import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { OrdersService } from '../orders.service';


@Component({
  selector: 'app-edit-main-order',
  templateUrl: './edit-main-order.component.html',
  styleUrls: ['./edit-main-order.component.scss']
})
export class EditMainOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private taxService: TaxConfigurationService,
    private ordersService: OrdersService
  ) { }
    
  loading: boolean = false;
  URLS = URLS;
  lineitems = [
    {
      image: 'https://ddykgwpgwgbj6.cloudfront.net/products/product_images/mildlee-fMveBTz2qWw-unsplash.jpg',
      product_name: "Simple TV",
      variant_title: "Medium/Red",
      vendor_name: "mobileip",
      price: 1250,
      quantity: 2,
      subtotal: 2500
    },
    {
      image: null,
      product_name: "Men T shirt",
      variant_title: "Medium/Red",
      vendor_name: "Nike",
      price: 1400,
      quantity: 1,
      subtotal: 1400
    }
  ];
  fulfillmentStatus: string = "Unfulfilled";
  paymentStatus: string = "Paid";
  subTotal: number = 3900;
  totalShipping: number = 120;
  totalTax: number = 0;
  grandTotal: number = 4020;
  tags: string[] = ["New"];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  selectedCustomer = 2;
  customer = {
    id: 3,
    first_name: "Sameed",
    last_name: "Awais",
    email: "sameed.awais@alchemative.com",
    phone: "03321233455"
  }

  getCustomers() {
    this.customers = concat(
      of([]),
      this.customerInput.pipe(
          distinctUntilChanged(),
          tap(() => this.customersLoading = true),
          switchMap(term => this.ordersService.getCustomersList(term).pipe(
              catchError(() => of([])),
              tap(() => this.customersLoading = false)
          ))
      )
    );
  }

  trackByFn(customer) {
    return customer.id;
  }

  ngOnInit(): void {
    this.getCustomers();
  }

}
