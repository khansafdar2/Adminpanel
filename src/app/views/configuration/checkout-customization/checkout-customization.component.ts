import { CheckoutCustomizationService } from './checkout-customization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-checkout-customization',
  templateUrl: './checkout-customization.component.html',
  styleUrls: ['./checkout-customization.component.scss']
})
export class CheckoutCustomizationComponent implements OnInit {

  constructor(    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private checkoutCustomizationService: CheckoutCustomizationService,
    private router: Router) { }


  URLS = URLS;
  loading = false;

  checkoutCustomizationForm = this.fb.group({
    customer_account : ['account_disabled'],
    customer_contact: ['checkout_with_phone_and_email'],
    full_name_option: ['last_name'],
    address_second_line: ['hidden'],
    postal_code: ['hidden'],
    promo_code: ['hidden'],
    credit_card: [true],
    cod: [false],
    wallet: [false],
    bank_transfer: [false],
    bank_detail: ['']
  })


  ngOnInit(): void {
  }

}
