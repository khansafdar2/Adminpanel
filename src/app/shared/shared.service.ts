import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private authService: AuthService) { }

  uploadMedia(file: File) {
    let formData = new FormData();
    formData.append('file', file);
    return Axios.post( environment.backend_url + '/products/product_media', formData, {
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
