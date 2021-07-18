import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GeneralInformationService {

  constructor(private authservice: AuthService) { }

  getStoreInfo() {
    return Axios.get(environment.backend_url + '/setting/store_info', {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  updateStoreInfo(data) {
    if(data.id) {
      return Axios.put(environment.backend_url + '/setting/store_info', data, {
        headers: {
          Authorization: this.authservice.token
        }
      })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authservice.signout();
        }
      });
    } else {
      return Axios.post(environment.backend_url + '/setting/store_info', data, {
        headers: {
          Authorization: this.authservice.token
        }
      })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authservice.signout();
        }
      });
    }
  }
}
