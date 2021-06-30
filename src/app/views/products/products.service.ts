import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private authService: AuthService) { }

  getProductsList(page: number, limit: number, filterString: string, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_list?page=' + page + '&limit=' + limit + filterString + searchString, {
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

  getProductTypes() {
    return Axios.get( environment.backend_url + '/products/product_type', {
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

  getProductGroups(page: number, limit: number, filterString: string, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_group_list?page=' + page + '&limit=' + limit + filterString + searchString, {
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
