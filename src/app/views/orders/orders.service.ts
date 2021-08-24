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
    return Axios.get(environment.backend_url + '/setting/payment_method', {
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

  createOrder(data) {
    return Axios.post(environment.backend_url + '/order/draft_order', data, {
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

  getOrders(page: number, limit: number, search: string, filterScring: string) {
    return Axios.get(environment.backend_url + '/order/parent_order_list?page=' + page + '&limit=' + limit + '&search=' + search + filterScring, {
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

  getMainOrder(id) {
    return Axios.get(environment.backend_url + '/order/parent_order/' + id, {
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

  getChildOrder(id) {
    return Axios.get(environment.backend_url + '/order/childorder/' + id, {
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

  getDraftOrder(id) {
    return Axios.get(environment.backend_url + '/order/draft_order/' + id, {
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

  updateMainOrder(data) {
    return Axios.put(environment.backend_url + '/order/parent_order', data, {
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

  updateChildOrder(data) {
    return Axios.put(environment.backend_url + '/order/childorder', data, {
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

  updateDraftOrder(data) {
    return Axios.put(environment.backend_url + '/order/draft_order', data, {
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

  getDraftOrders(page: number, limit: number, search: string) {
    return Axios.get(environment.backend_url + '/order/draft_order_list?page=' + page + '&limit=' + limit + '&search=' + search, {
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

  changeOrderStatus(data) {
    return Axios.put(environment.backend_url + '/order/order_status_change', data, {
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
