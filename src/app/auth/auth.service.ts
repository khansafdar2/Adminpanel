import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import URLS from '../shared/urls';

interface UserPermission {
  id: number;
  dashboard: boolean;
  customization: boolean
  theme: boolean;
  products: boolean;
  orders: boolean;
  customer: boolean;
  discounts: boolean;
  configuration: boolean;
  vendor: boolean;
}

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
    if(localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  signedIn: boolean = false;
  token: string;
  user_permissions: UserPermission;
  user = {
    id: null,
    email: "",
    first_name: "",
    last_name: "",
    token: "",
    username: ""
  };

  signin(token: string, permissions: UserPermission, user) {
    this.cookies.set('token', token, 1, '/');
    this.token = token;
    this.user_permissions = permissions;
    delete user.permission;
    this.user = user;
    localStorage.setItem('permissions', JSON.stringify(permissions));
    localStorage.setItem('user', JSON.stringify(user));
    this.signedIn = true;
  }

  signout() {
    this.cookies.delete('token');
    this.token = undefined;
    this.user_permissions = null;
    this.signedIn = false;
    localStorage.removeItem('permissions');
    this.router.navigate([URLS.signin]);
  }
}
