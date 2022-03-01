import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingRegionService {


  constructor(private authService: AuthService) { }

  getShippingRegionList(page, limit) {
    return Axios.get( environment.backend_url + '/setting/region_list?page=' + page + "&limit=" + limit, {
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

  getShippingRegionDetail(id) {
    return Axios.get( environment.backend_url + '/setting/region/' + id, {
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

  getCountryList(id, page, limit) {
    return Axios.get( environment.backend_url + '/setting/country_list?region_id=' + id + "&page=" + page + "&limit=" + limit, {
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

  getCountryDetail(id) {
    return Axios.get( environment.backend_url + '/setting/country/' + id, {
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

  getCityList(id, page, limit) {
    return Axios.get( environment.backend_url + '/setting/city_list?country_id=' + id + "&page=" + page + "&limit=" + limit, {
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

  getzoneCityList(id, zoneID, page, limit) {
    let endpoint;
    if (zoneID == null) {
      endpoint = '/setting/city_list?country_id=' + id + "&page=" + page + "&limit=" + limit
    } else {
      endpoint = '/setting/city_list?country_id=' + id + '&zone_id=' + zoneID + "&page=" + page + "&limit=" + limit
    }
    return Axios.get( environment.backend_url + endpoint, {
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

  createCity(data) {
    return Axios.post( environment.backend_url + '/setting/city', data, {
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

  getCityDetail(id) {
    return Axios.get( environment.backend_url + '/setting/city/' + id, {
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

  updateCity(data) {
    return Axios.put( environment.backend_url + '/setting/city', data, {
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

  deleteCity(id) {
    return Axios.delete( environment.backend_url + '/setting/city/' + id, {
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
