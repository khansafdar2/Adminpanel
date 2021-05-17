import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Axios from 'axios';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private fb: FormBuilder,  private router: Router, private authService: AuthService) { }

  loading: boolean = false;
  formError: string = "";
  signinForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.signinForm.valid) {
      this.loading = true;
      Axios.post(environment.backend_url + "/signin", {
        usernameOrEmail: this.signinForm.get('email').value,
        password: this.signinForm.get('password').value
      })
      .then((response) => {
        this.loading = false;
        this.authService.signin(response.data.token, response.data.role_permission);

        this.router.navigate(['/dashboard']);
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
