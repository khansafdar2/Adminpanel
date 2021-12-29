import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private authService: AuthService) { }


  getVendorsList(page: number, limit: number, search: string = '', filters: string  = '' ) {
    return Axios.get( environment.backend_url + '/vendors/vendor_list?page=' + page + '&limit=' + limit + '&search=' + search + filters , {
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

  deleteVendor(urlString){
    return Axios.delete( environment.backend_url + '/vendors/vendor/' + urlString , {
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

  createVendor(data) {
    return Axios.post( environment.backend_url + '/vendors/vendor', data, {
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

  updateVendor(data) {
    return Axios.put( environment.backend_url + '/vendors/vendor', data, {
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

  getSignleVendor(id) {
    return Axios.get(environment.backend_url + '/vendors/vendor/' + id, {
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

  deleteCommission(oldID,newID){
    return Axios.delete( environment.backend_url + '/vendors/commission/' + oldID + '?new_id=' + newID , {
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
