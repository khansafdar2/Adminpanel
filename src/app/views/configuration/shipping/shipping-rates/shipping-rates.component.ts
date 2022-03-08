import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../shipping.service';
import URLS from 'src/app/shared/urls';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AddShippingRatesComponent } from '../../shipping/shipping-rates/add-shippping-rate/add-shipping-rate.component'
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-shipping-rates',
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.scss']
})
export class ShippingRatesComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar,
    private authservice: AuthService,
    
  ) { }

  loading = false
  URLS = URLS
  shippingMethods = null
  shippingRates = []
  shippingRatesDefault = []
  is_vendor = this.authservice.user.is_vendor;
  approvalStatus = '';

  goBack()
  {
    this.router.navigate([URLS.shipping]);
  }
  
  getShippingRates()
  {
    this.shippingService.getShippingRates().then((resp) => {
      if (resp)
      {
        this.loading = false
        this.shippingRates = resp.data.custom_shipping;
        this.shippingRatesDefault = resp.data.default_shipping;
        this.approvalStatus = resp.data.custom_shipping.status;
      }
    })
  }

  editShippingRate(id)
  {
    this.router.navigate([URLS.shippingRates, URLS.edit, id]);
  }

  editDefaultShippingRate(id)
  {
    this.router.navigate([URLS.defaultShipping, URLS.edit, id]);
  }

  deleteShippingRate(id, name)
  {
    let dialogRef = this.dialog.open(DeleteShippingRateDialog, {
      width: "600px",
      data : {
        id : id,
        name : name
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if(added) {
        this.snackbar.open("Shipping deleted.", "", {duration: 3000});
        this.getShippingRates();
      }
    });
  }

  ngOnInit(): void {
    this.loading = true
    this.getShippingRates()
  }

}


@Component({
  selector: 'delete-shipping-rate-dialog',
  templateUrl: '../dialogs/delete-shipping-rate-dialog.html',
})
export class DeleteShippingRateDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteShippingRateDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ){
    this.rateId = data.id;
    this.rateName = data.name;
  }
  rateName : ''
  rateId : ''
  loading: boolean = false;
  
  onDelete() {
    this.loading = true;
    this.shippingService.deleteShippingRate(this.rateId).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Shipping method created successfuly.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }
}