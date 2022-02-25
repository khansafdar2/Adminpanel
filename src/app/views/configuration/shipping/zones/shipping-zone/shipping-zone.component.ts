import { ViewZoneDialog } from './../../shipping.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../../shipping.service';
import URLS from 'src/app/shared/urls';
import { MatDialog } from '@angular/material/dialog';
import { AddZoneDialog, DeleteZoneDialog } from '../../shipping.component'

@Component({
  selector: 'app-shipping-zone',
  templateUrl: './shipping-zone.component.html',
  styleUrls: ['./shipping-zone.component.scss']
})
export class ShippingZoneComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private shippingService: ShippingService,
    private authService: AuthService,
  ) { }

  loading = false;
  URLS = URLS;
  is_vendor = this.authService.user.is_vendor;
  shippingMethods = null;
  zones = []
  regions = null;
  countries = null;
  countriesWithoutZone = null;
  regionsWithoutZone = null;


  getzones() {
    this.loading = true
    this.shippingService.getZones().then((resp) => {
      this.loading = false
      if (resp) {
        this.zones = resp.data.results
      }
    })
  }

  goBack() {
    this.router.navigate([URLS.shipping]);
  }

  getShippingMethods() {
    this.loading = true;
    this.shippingService.getShippingMethods(1, 50).then(resp => {
      this.loading = false;
      if (resp) {
        this.shippingMethods = resp.data.results;
      }
    })
  }

  editZone(id) {
    let dialogRef = this.dialog.open(AddZoneDialog, {
      width: "600px",
      data: {
        zoneId: id
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getShippingMethods();
      }
    });
  }

  getRegionName(regions) {
    let name = regions.map((reg) => {
      return reg.name
    })
    return name.join(', ')
  }

  deleteZone(id, name) {
    let dialogRef = this.dialog.open(DeleteZoneDialog, {
      width: "600px",
      data: {
        zoneId: id,
        zoneName: name
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getShippingMethods()
        this.getzones()
      }
    });
  }


  viewZone(id) {
    let dialogRef = this.dialog.open(ViewZoneDialog, {
      width: "600px",
      data: {
        zoneId: id,
      }
    });

  }


  onNewShippingMethod() {
    let dialogRef = this.dialog.open(AddZoneDialog, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getShippingMethods();
        this.getzones()
      }
    });
  }


  getRegionsAndCountries() {
    this.shippingService.getRegionCount().then(resp => {
      if (resp) {
        console.log(resp.data);
        this.countries = resp.data.countries;
        this.regions = resp.data.region;
        this.countriesWithoutZone = resp.data.countries_without_zone;
        this.regionsWithoutZone = resp.data.region_without_zone;
      }
    })
  }

  ngOnInit(): void {
    this.getzones();
    this.getRegionsAndCountries();
  }
}
