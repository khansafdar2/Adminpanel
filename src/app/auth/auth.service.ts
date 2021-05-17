import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookies: CookieService) { }

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
}
