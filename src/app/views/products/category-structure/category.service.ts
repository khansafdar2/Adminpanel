import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private authService: AuthService) { }

  getMainCategories() {
    return Axios.get( environment.backend_url + '/products/main_category', {
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

  getSubCategories(mainCategoryID) {
    return Axios.get( environment.backend_url + '/products/sub_category?main_category=' + mainCategoryID, {
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

  getSuperSubCategories(subCategoryID) {
    return Axios.get( environment.backend_url + '/products/super_sub_category?sub_category=' + subCategoryID, {
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

  changeCatgeoryStatus(id, category_type, is_active) {
    return Axios.put( environment.backend_url + '/products/category_status_change', {
      id,
      category_type,
      is_active
    }, {
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

  createMainCategory(data) {
    return Axios.post( environment.backend_url + '/products/main_category', data, {
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

  getMainCategoryDetail(id) {
    return Axios.get( environment.backend_url + '/products/main_category/' + id, {
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

  updateMainCategory(data) {
    return Axios.put( environment.backend_url + '/products/main_category', data, {
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

  createSubCategory(data) {
    return Axios.post( environment.backend_url + '/products/sub_category', data, {
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

  getSubCategoryDetail(id) {
    return Axios.get( environment.backend_url + '/products/sub_category/' + id, {
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

  updateSubCategory(data) {
    return Axios.put( environment.backend_url + '/products/sub_category', data, {
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

  createSuperSubCategory(data) {
    return Axios.post( environment.backend_url + '/products/super_sub_category', data, {
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

  getSuperSubCategoryDetail(id) {
    return Axios.get( environment.backend_url + '/products/super_sub_category/' + id, {
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

  updateSuperSubCategory(data) {
    return Axios.put( environment.backend_url + '/products/super_sub_category', data, {
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

  deleteCatgeory(id, type) {
    let endpoint = "";
    switch (type) {
      case "main":
        endpoint = "main_category";
        break;
      case "sub":
        endpoint = "sub_category";
        break;
      case "supersub":
        endpoint = "super_sub_category";
        break;
      default:
        break;
    }
    return Axios.delete( environment.backend_url + '/products/' + endpoint + "/" + id, {
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

  updateCategoryPosition(type, categoryData) {
    let data = {
      type,
      category_data: categoryData
    }
    return Axios.put( environment.backend_url + '/products/category_position', data, {
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
