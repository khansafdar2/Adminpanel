import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ContentApprovalService {

  constructor(private authService: AuthService) { }

  getApprovalRequests(page: number, limit: number, filterString: string) {
    return Axios.get( environment.backend_url + '/vendors/approval_content?page=' + page + '&limit=' + limit + filterString, {
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

  updateApprovalStatus(data) {
    return Axios.put( environment.backend_url + '/vendors/change_approval_status', data, {
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
