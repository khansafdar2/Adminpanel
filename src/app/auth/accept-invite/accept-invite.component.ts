import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { environment } from '../../../environments/environment';
import { UsersService } from 'src/app/views/configuration/user-management/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {

  constructor(private usersService: UsersService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  loading: boolean = true;
  logo_img: string = `assets/${environment.client_img_folder}/logo.png`;
  key: string;
  expired: boolean;
  formError: string = "";
  setupPasswordForm = this.fb.group({
    password: ['', [Validators.required]],
    confirm_password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.key = this.route.snapshot.paramMap.get('key');
    this.verifyKey();
  }

  verifyKey() {
    this.usersService.checkInviteStatus(this.key).then(resp => {
      if(resp) {
        this.expired = resp.data.expired;
        this.loading = false;
      }
    })
  }

  onSubmit() {
    this.formError = "";
    let data = this.setupPasswordForm.value;
    if(data.password !== data.confirm_password) {
      this.formError = "Passwords do not match.";
      return;
    }

    this.loading = true;
    data.key = this.key;
    this.usersService.signupPassword(data).then(resp => {
      if(resp) {
        this.loading = false;
        this.authService.signin(resp.data.token, resp.data.permission, resp.data);
        this.router.navigate([URLS.home]);
      }
    }).catch(error =>{
      this.loading = false;
      if(error.isAxiosError) {
        if(error.response.status === 400) {
          this.formError = error.response.data.detail;
        }
      }
    });
  }

}
