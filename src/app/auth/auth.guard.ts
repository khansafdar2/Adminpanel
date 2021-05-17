import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, RouterState } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.authService.signedIn) {
      this.router.navigate(['/signin'])
      return false
    }

    return true
  }
}


@Injectable({
  providedIn: 'root'
})
export class LoggedOutAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.signedIn) {
      this.router.navigate(['/dashboard'])
      return false
    }

    return true
  }
}
