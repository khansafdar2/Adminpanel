import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private authService: AuthService) {

  }


  getRevenue(is_vendor, vendorID, start_date, end_date) {
    let endpoint;
    if (is_vendor) {
      if (start_date && end_date) {
        endpoint = "/dashboard/revenue?start_date=" + start_date + "&end_date=" + end_date;
      } else {
        endpoint = "/dashboard/revenue";
      }
    } else {
      if (vendorID) {
        if (start_date && end_date) {
          endpoint = "/dashboard/revenue?vendor_id=" + vendorID + "&start_date=" + start_date + "&end_date=" + end_date;
        } else {
          endpoint = "/dashboard/revenue?vendor_id=" + vendorID;
        }
      } else {
        if (start_date && end_date) {
          endpoint = "/dashboard/revenue?start_date=" + start_date + "&end_date=" + end_date;
        } else {
          endpoint = "/dashboard/revenue";
        }
      }
    }
    return Axios.get(environment.backend_url + endpoint, {
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


  getOrderAnalysis(is_vendor, vendorID, start_date, end_date) {
    let endpoint;
    if (is_vendor) {
      if (start_date && end_date) {
        endpoint = "/dashboard/order_analysis?start_date=" + start_date + "&end_date=" + end_date;
      } else {
        endpoint = "/dashboard/order_analysis";
      }
    } else {
      if (vendorID) {
        if (start_date && end_date) {
          endpoint = "/dashboard/order_analysis?vendor_id=" + vendorID + "&start_date=" + start_date + "&end_date=" + end_date;
        } else {
          endpoint = "/dashboard/order_analysis?vendor_id=" + vendorID;
        }
      } else {
        if (start_date && end_date) {
          endpoint = "/dashboard/order_analysis?start_date=" + start_date + "&end_date=" + end_date;
        } else {
          endpoint = "/dashboard/order_analysis";
        }
      }
    }
    return Axios.get(environment.backend_url + endpoint, {
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


  getProductAnalysis(is_vendor, vendorID) {
    let endpoint;
    if (is_vendor) {
      endpoint = "/dashboard/product_analysis";
    } else {
      if (vendorID) {
        endpoint = "/dashboard/product_analysis?vendor_id=" + vendorID;
      } else {
        endpoint = "/dashboard/product_analysis";
      }
    }
    return Axios.get(environment.backend_url + endpoint, {
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