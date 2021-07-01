import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private authService: AuthService) { }

  afuUploadAPI = {
    url: environment.backend_url + '/products/media',
    method:"POST",
    headers: {
      // "Content-Type" : "multipart/form-data",
      "Authorization" : this.authService.token
    }
  }

  uploadMedia(file: File) {
    let formData = new FormData();
    formData.append('file', file);
    return Axios.post( environment.backend_url + '/products/media', formData, {
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

  makeCombinationsFromLists(...args) {
    var r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a.join("/"));
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
  }
}
