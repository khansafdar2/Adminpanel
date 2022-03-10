import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, UrlSegment } from '@angular/router';
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.dashboard) {
      return true;
    } else {
      if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      }
      else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.orders) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      }
      else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customer) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      } else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.discounts) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      } else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
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
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      return true;
    } else {
    if(this.authService.user.is_vendor) {
      if(route.url[0].path === "shipping" || route.url[0].path === "zones" || route.url[0].path === "shipping-rates" ) {
        return true;
      } 
    }
    
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      } else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      }

    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class CustomizationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
        this.router.navigate(["/", URLS.configuration]);
        return false;
      }
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class VendorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.user.is_vendor) {
      if(route.url[0].path === "edit" && route.url[1].path ==  this.authService.user.vendor_id) {
        return true;
      }
    } else if (this.authService.user_permissions.vendor) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ProductListGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      if (this.authService.user_permissions.product_list) {
        return true;
      }  else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class ProductGrouptGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      if (this.authService.user_permissions.product_groups) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}



@Injectable({
  providedIn: 'root'
})
export class ProductCollectiontGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      if (this.authService.user_permissions.collections) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class CategoryStructureGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      if (this.authService.user_permissions.categories) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class BrandsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.products) {
      if (this.authService.user_permissions.brands) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}



@Injectable({
  providedIn: 'root'
})
export class HomePageGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.homepage) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class StaticPagesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.static_pages) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class HeaderPagesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.header) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class FooterPagesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.footer) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class NavigationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.navigation) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class FilterGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.customization) {
      if (this.authService.user_permissions.filters) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class MainDiscountGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.discounts) {
      if (this.authService.user_permissions.main_discounts) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CouponGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.discounts) {
      if (this.authService.user_permissions.coupons) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class StoreSettingGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.store_setting) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.user_management) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class LoyaltyGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.loyalty) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ShippingRegionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.shipping_regions) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class ShippingMethodsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      debugger
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.shipping_methods) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    } else {
      if(this.authService.user.is_vendor) {
        if(route.url[0].path === "shipping" || route.url[0].path === "zones" || route.url[0].path === "shipping-rates" || route.url[0].path === "all" || route.url[0].path === "add" || route.url[0].path === "edit"  ) {
          return true;
        } 
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutSettingGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.configuration) {
      if (this.authService.user_permissions.checkout_setting) {
        return true;
      } else {
        if (this.authService.user_permissions.dashboard) {
          this.router.navigate(["/", URLS.home]);
          return false;
        } else if (this.authService.user_permissions.customization) {
          this.router.navigate(["/", URLS.homepage]);
          return false;
        } else if (this.authService.user_permissions.orders) {
          this.router.navigate(["/", URLS.orders]);
          return false;
        } else if (this.authService.user_permissions.customer) {
          this.router.navigate(["/", URLS.customers]);
          return false;
        } else if (this.authService.user_permissions.discounts) {
          this.router.navigate(["/", URLS.discounts]);
          return false;
        } else if (this.authService.user_permissions.configuration) {
          this.router.navigate(["/", URLS.configuration]);
          return false;
        }
      }
      return true;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class ApprovalGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.approvals) {
      return true;
    } else {
      if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      }
      else if (this.authService.user_permissions.products) {
        this.router.navigate(["/", URLS.products]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
        this.router.navigate(["/", URLS.configuration]);
        return false;
      }
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class NotificationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.user_permissions.notifications) {
      return true;
    } else {
      if (this.authService.user_permissions.dashboard) {
        this.router.navigate(["/", URLS.home]);
        return false;
      } else if (this.authService.user_permissions.customization) {
        this.router.navigate(["/", URLS.homepage]);
        return false;
      } else if (this.authService.user_permissions.orders) {
        this.router.navigate(["/", URLS.orders]);
        return false;
      } else if (this.authService.user_permissions.customer) {
        this.router.navigate(["/", URLS.customers]);
        return false;
      } else if (this.authService.user_permissions.discounts) {
        this.router.navigate(["/", URLS.discounts]);
        return false;
      } else if (this.authService.user_permissions.configuration) {
        this.router.navigate(["/", URLS.configuration]);
        return false;
      }
    }
  }
}
