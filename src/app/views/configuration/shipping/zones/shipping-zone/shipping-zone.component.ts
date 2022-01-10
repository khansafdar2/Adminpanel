import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../../shipping.service';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/shared/datatable/datatable.component';
import {AddZoneDialog, DeleteZoneDialog } from '../../shipping.component'

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


  ) { }

  loading = false
  URLS = URLS
  shippingMethods = null
  zones = []

  getzones()
  {
    this.loading = true
    this.shippingService.getZones().then((resp) => {
      this.loading = false
      if (resp)
      {
        this.zones = resp.data.results
      }
    })
  }

  ngOnInit(): void {
    this.getzones()
  } 

  goBack()
  {
    this.router.navigate([URLS.shipping]);
  }

  getShippingMethods() {
    this.loading = true;
    this.shippingService.getShippingMethods(1, 50).then(resp => {
      this.loading = false;
      if(resp) {
        this.shippingMethods = resp.data.results;
      }
    })
  }

  zoneRegions()
  {
    return "ahmad"
  }

  editZone(id)
  {
    let dialogRef = this.dialog.open(AddZoneDialog, {
      width: "600px",
      data : {
        zoneId : id
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if(added) {
        this.getShippingMethods();
      }
    });
  }

  getRegionName(regions)
  {
    let name =  regions.map((reg) => {
      return reg.name
    })
    return name.join(', ')
  }

  deleteZone(id, name)
  {
    debugger
    let dialogRef = this.dialog.open(DeleteZoneDialog, {
      width: "600px",
      data : {
        zoneId : id,
        zoneName : name
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if(added) {
        this.getShippingMethods()
        this.getzones()
      }
    });
  }

  onNewShippingMethod() {
    let dialogRef = this.dialog.open(AddZoneDialog, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe(added => {
      if(added) {
        this.getShippingMethods();
        this.getzones()
      }
    });
  }
}
