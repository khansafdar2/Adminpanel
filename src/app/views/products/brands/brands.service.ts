import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private authService: AuthService) { }

  getBrandsList(page: number, limit: number) {
    return Axios.get( environment.backend_url + '/products/brand_list?page=' + page + '&limit=' + limit, {
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
