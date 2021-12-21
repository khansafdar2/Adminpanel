import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private authService: AuthService) { }

  getHomepage() {
    return Axios.get( environment.backend_url + '/cms/homepage', {
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

  updateHomepage(data) {
    return Axios.put( environment.backend_url + '/cms/customization', data, {
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
