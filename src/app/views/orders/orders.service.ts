import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Axios, { AxiosResponse }  from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private authService: AuthService, private readonly http: HttpClient) { }

  getCustomersList(search: string = ""): Observable<any> {
    return this.http.get(environment.backend_url + '/order/orders_customer_list?search=' + search, {
      headers: {
        Authorization: this.authService.token
      }
    });
  }

  getPaymentMethods() {
    return Axios.get( environment.backend_url + '/setting/payment_method', {
        headers: {
          Authorization: this.authService.token
        }
      })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }
}
