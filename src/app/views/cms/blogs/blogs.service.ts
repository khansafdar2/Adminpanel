import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class BlogsService {
 
  constructor(private authService: AuthService) { }
 
  getBlogPages() {
    return Axios.get(environment.backend_url + '/cms/blog_list', {
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

  getCategories() {
    return Axios.get(environment.backend_url + '/cms/blog_category_list', {
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
 
  createBlogPage(data) {
    return Axios.post(environment.backend_url + '/cms/blog', data, {
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

  createCategory(data) {
    return Axios.post(environment.backend_url + '/cms/blog_category', data, {
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
 
  getBlogPage(id) {
    return Axios.get(environment.backend_url + '/cms/blog/' + id, {
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

  getCategory(id) {
    return Axios.get(environment.backend_url + '/cms/blog_category/' + id, {
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
  
 
  updateBlogPage(data) {
    return Axios.put(environment.backend_url + '/cms/blog', data, {
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

  updateCategory(data) {
    return Axios.put(environment.backend_url + '/cms/blog_category', data, {
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
 
  deleteBlogPage(id) {
    return Axios.delete(environment.backend_url + '/cms/blog/' + id, {
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

  deleteCategory(id) {
    return Axios.delete(environment.backend_url + '/cms/blog_category/' + id, {
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
