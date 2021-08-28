import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import URLS from '../shared/urls';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.dashboard) {
        return true;
      } else {
        if(this.authService.user_permissions.products) {
          this.router.navigate(["/", URLS.products]);
          return false;
        } else if(this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if(this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if(this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if(this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
  }
}



@Injectable({
  providedIn: 'root'
})
export class ProductsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.products) {
        return true;
      } else {
        if(this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if(this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if(this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if(this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if(this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
  }
}


@Injectable({
  providedIn: 'root'
})
export class OrdersGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.orders) {
        return true;
      } else {
        if(this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if(this.authService.user_permissions.products) {
          this.router.navigate(["/", URLS.products]);
          return false;
        } else if(this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if(this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if(this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
  }
}


@Injectable({
  providedIn: 'root'
})
export class CustomersGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.customer) {
        return true;
      } else {
        if(this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if(this.authService.user_permissions.products) {
          this.router.navigate(["/", URLS.products]);
          return false;
        } else if(this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if(this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if(this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
  }
}


@Injectable({
  providedIn: 'root'
})
export class DiscountsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.discounts) {
        return true;
      } else {
        if(this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if(this.authService.user_permissions.products) {
          this.router.navigate(["/", URLS.products]);
          return false;
        } else if(this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if(this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if(this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
  }
}


@Injectable({
  providedIn: 'root'
})
export class ConfigurationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.user_permissions.configuration) {
        return true;
      } else {
        if(this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if(this.authService.user_permissions.products) {
          this.router.navigate(["/", URLS.products]);
          return false;
        } else if(this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if(this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if(this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        }
      }
  }
}
