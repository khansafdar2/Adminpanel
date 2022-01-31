import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VariantSelectorService {
  constructor(private authService: AuthService) { }

  getProductsWithVariants(page: number, limit: number, searchQuery: string, vendor: string = "") {
    let vendorString = vendor ?  "&vendor=" + vendor : "";
    return Axios.get( environment.backend_url + '/order/orders_product_list?page=' + page + "&limit=" + limit + "&search=" + searchQuery + vendorString, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }
}
