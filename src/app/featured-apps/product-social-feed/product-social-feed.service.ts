import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductSocialFeedService {

  constructor(private authService: AuthService) { }

  getProductSocialFeedList() {
    return Axios.get( environment.backend_url + '/socialfeed/feed_list', {
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

  createProductSocialFeed(data) {
    return Axios.post( environment.backend_url + '/socialfeed/feed', data, {
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

  createProductSettingSocialFeed(data) {
    return Axios.post( environment.backend_url + '/socialfeed/settings', data, {
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

  getSingleProductSocialFeed(id) {
    return Axios.get(environment.backend_url + '/socialfeed/feed/' + id, {
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

  getSingleSettingProductSocialFeed() {
    return Axios.get(environment.backend_url + '/socialfeed/settings', {
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

  updateProductSocialFeed(data) {
    return Axios.put( environment.backend_url + '/socialfeed/feed', data, {
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

  deleteFeed(id) {
    return Axios.delete( environment.backend_url + '/socialfeed/feed/' + id, {
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
