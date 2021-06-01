import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private authservice: AuthService) { }

  getUsers() {
    return Axios.get(environment.backend_url + '/authentication/users', {
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

  addUser(data) {
    return Axios.post(environment.backend_url + '/authentication/users', data, {
      headers: {
        Authorization: this.authservice.token
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  checkInviteStatus(key) {
    return Axios.post(environment.backend_url + '/authentication/check_invite_status', {key});
  }

  signupPassword(data) {
    return Axios.post(environment.backend_url + '/authentication/input_password', data);
  }

  getUser(id) {
    return Axios.get(environment.backend_url + '/authentication/users/' + id, {
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

  updateUser(data) {
    return Axios.put(environment.backend_url + '/authentication/users', data, {
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

  changePassword(data) {
    return Axios.put(environment.backend_url + '/authentication/change_password', data, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
      return error.response;
    });
  }

  transferOwnership(id) {
    return Axios.post(environment.backend_url + '/authentication/transfer_ownership', {id}, {
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
