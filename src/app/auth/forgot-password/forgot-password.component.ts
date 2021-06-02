import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Axios from 'axios';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  loading: boolean = false;
  emailSent: boolean = false;
  codeVerified: boolean = false;
  emailAddressForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  codeVerifyForm = this.fb.group({
    code: ['', [Validators.required]]
  });

  setPasswordForm = this.fb.group({
    code: [''],
    password: ['', [Validators.required]],
    confirm_password: ['', Validators.required]
  });
  formError: string = '';

  verifyEmail() {
    this.loading = true;
    Axios.post(environment.backend_url + "/authentication/forgotPassword", this.emailAddressForm.value)
    .then(resp => {
      console.log(resp.data);
      this.loading = false;
      this.emailSent = true;
    });
  }

  verifyCode() {
    this.loading = true;
    Axios.post(environment.backend_url + "/authentication/verify_code", this.codeVerifyForm.value)
    .then(resp => {
      console.log(resp.data);
      this.loading = false;
      if(resp.data.id) {
        this.codeVerified = true;
        this.setPasswordForm.patchValue({
          code: this.codeVerifyForm.get('code').value
        })
      }
    });
  }

  setPassword() {
    let data = this.setPasswordForm.value;
    if(data.password !== data.confirm_password) {
      this.formError = "Both passwords do not match.";
      return;
    }
    this.loading = true;
    Axios.post(environment.backend_url + "/authentication/reset_password", data)
    .then(resp => {
      console.log(resp.data);
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

}
