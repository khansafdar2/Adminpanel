import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Axios from 'axios';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import URLS  from '../../shared/urls';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  loading: boolean = false;
  formError: string = "";
  logo_img: string = `assets/${environment.client_img_folder}/logo.png`;
  clientName: string = environment.client_name;
  isVendorPortal = this.authService.isVendorPortal;
  signinForm = this.fb.group({
    username_or_email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  URLs = URLS;

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.signinForm.valid) {
      this.loading = true;
      Axios.post(environment.backend_url + "/authentication/signin", this.signinForm.value)
      .then((response) => {
        this.loading = false;
        let vendorCheck = false;
        if(this.isVendorPortal) {
          if(response.data.is_vendor) {
            vendorCheck = true;
          }
        } else {
          if(!response.data.is_vendor) {
            vendorCheck = true;
          }
        }
        if(!environment.production) {
          vendorCheck = true;
        }

        if(vendorCheck) {
          this.authService.signin(response.data.token, response.data.permission, response.data);
          this.router.navigate(['/dashboard']);
        } else {
          this.formError = "Email or password is incorrect.";
        }
      }, (error) => {
        this.loading = false;
        if(error.response.status === 422) {
          this.formError = "Email or password is incorrect.";
        } else {
          this.formError = "Could not sign in because of an error.";
        }
      });
    }
  }

}
