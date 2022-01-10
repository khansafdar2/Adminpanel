import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../shipping.service';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {AddZoneDialog } from '../../shipping.component'

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
  ) { }

  loading = false
  URLS = URLS
  shippingMethods = null
  shippings = []

  goBack()
  {
    this.router.navigate([URLS.shipping]);
  }
  
  newShipping()
  {

  }

  ngOnInit(): void {
  }

}
