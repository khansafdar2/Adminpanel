import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(private authservice: AuthService) { }

  getShippingMethods(page, limit) {
    return Axios.get(environment.backend_url + '/setting/shipping_list?page='+ page + '&limit=' + limit, {
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

  createShipping(data) {
    return Axios.post(environment.backend_url + '/setting/shipping', data, {
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

  updateShipping(data) {
    return Axios.put(environment.backend_url + '/setting/shipping', data, {
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

  deleteShipping(id) {
    return Axios.delete(environment.backend_url + '/setting/shipping/' + id, {
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

  getRegions() {
    return Axios.get(environment.backend_url + '/setting/region_list', {
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

  getCountries(regionId) {
    return Axios.get(environment.backend_url + '/setting/country_list?region_id=' + regionId, {
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

  getCities(countryId) {
    return Axios.get(environment.backend_url + '/setting/city_list?country_id=' + countryId, {
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

  createZone(data) {
    return Axios.post(environment.backend_url + "/shipping/zone", data, {
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

  getZones() {
    return Axios.get(environment.backend_url + "/shipping/custom_zone_list", {
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

  getDefaultZones() {
    return Axios.get(environment.backend_url + "/shipping/default_zone_list", {
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

  getSingleZones(id) {
    return Axios.get(environment.backend_url + "/shipping/zone/" + id, {
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

  updateZone(data) {
    return Axios.put(environment.backend_url + "/shipping/zone", data, {
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

  deleteZone(id)
  {
    return Axios.delete(environment.backend_url + "/shipping/zone/" + id, {
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

  createShippingRate(data)
  {
    return Axios.post(environment.backend_url + "/shipping/shipping", data, {
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

  updateShippingRate(data)
  {
    return Axios.put(environment.backend_url + "/shipping/shipping", data, {
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

  getSingleShippingRate(id)
  {
    return Axios.get(environment.backend_url + "/shipping/shipping/" + id, {
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

  getShippingRates()
  {
    return Axios.get(environment.backend_url + "/shipping/shipping", {
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

  deleteShippingRate(id)
  {
    return Axios.delete(environment.backend_url + "/shipping/shipping/" + id, {
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
