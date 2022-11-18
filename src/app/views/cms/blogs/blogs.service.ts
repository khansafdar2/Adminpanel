import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(private authService: AuthService) { }

  getBlogPages(page, limit) {
    return Axios.get(environment.backend_url + '/cms/blog_list?page=' + page + '&limit=' + limit, {
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

  getCategories(page, limit) {
    return Axios.get(environment.backend_url + '/cms/blog_category_list?page=' + page + '&limit=' + limit, {
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

  getCategoriesBlog() {
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
    debugger
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

  statusChange(data) {
    debugger
    var updatedData
    let simple:string = data.id
    // simple.string();
    let id:string[]=[];
    id.push(simple)
    
    // var id = id1.string()
    console.log(typeof id)

    if (data.status == "Publish") {
      updatedData = {
        status: "Draft",
        ids:id,
      }
    }
    else {
      updatedData = {
        status: "Publish",
        ids:id,
      }
    }
    return Axios.put(environment.backend_url + '/cms/update_blog_status', updatedData, {
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
