import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-checkout-customization',
  templateUrl: './checkout-customization.component.html',
  styleUrls: ['./checkout-customization.component.scss']
})
export class CheckoutCustomizationComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading = false;
  ngOnInit(): void {
  }

}
