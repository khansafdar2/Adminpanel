import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import URLS from '../shared/urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookies: CookieService, private router: Router) {
    if(this.cookies.check('token')) {
      this.signedIn = true
      this.token = this.cookies.get('token')
    }
    if(localStorage.getItem('permissions')) {
      this.user_permissions = JSON.parse(localStorage.getItem('permissions'));
    }
  }

  signedIn: boolean = false;
  token: string;
  user_permissions: {};

  signin(token: string, permissions: {}) {
    console.log(permissions)
    this.cookies.set('token', token, 1, '/');
    this.token = token;
    this.user_permissions = permissions;
    this.signedIn = true;
  }

  signout() {
    this.cookies.delete('token');
    this.token = undefined;
    this.user_permissions = {};
    this.signedIn = false;
    this.router.navigate([URLS.signin]);
  }
}
