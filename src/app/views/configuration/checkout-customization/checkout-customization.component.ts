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
    customer_accounts : ['optional'],
    customer_contacts: ['both'],
    full_name: ['first_name'],
    address_second_line: ['hidden'],
    postal_code: ['hidden'],
    promo_code: ['hidden'],
    is_wallet: [true],
  })

  onSubmit() {
    this.loading = true;
    this.checkoutCustomizationService.addCheckoutSetting(this.checkoutCustomizationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Setting created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.configuration]);
      }
    });
  }


  getCheckoutSetting(){
    this.checkoutCustomizationService.getCheckoutSetting().then((resp)=> {
      if (resp) {
        this.checkoutCustomizationForm.patchValue(resp.data);
      }
    })
  }


  ngOnInit(): void {
    this.getCheckoutSetting();
  }

}
