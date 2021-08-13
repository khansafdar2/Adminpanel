import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { OrdersService } from '../orders.service';


@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private taxService: TaxConfigurationService,
    private ordersService: OrdersService
  ) { }

  loading: boolean = false;
  URLS = URLS;
  lineitems = [];
  taxApplied = 0;
  lineitemsForm = this.fb.group({
    lineitems: this.fb.array([])
  });
  subTotal = 0;
  totalShipping = 0;
  totalTax = 0;
  grandTotal = 0;
  paymentStatus = "Pending";
  notes: string = "";
  tags: string[] = [];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  selectedCustomer = null;

  getTaxConfiguration() {
    this.taxService.getTaxInfo().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.taxApplied = parseFloat(resp.data.tax_percentage);
      }
    })
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
      // this.ordersService.getCustomersList().then(resp => {
    //   if(resp) {
    //     this.customers = resp.data.results;
    //   }
    // });
  }

  trackByFn(customer) {
    return customer.id;
  }

  onQtyKeydown(event: KeyboardEvent) {
    if(event.key === ".") {
      event.preventDefault();
    }
  }

  deleteLineItem(index) {
    (this.lineitemsForm.get('lineitems') as FormArray).removeAt(index);
    this.updateTotals();
  }

  onAddItems(items) {
    console.log(items);
    this.lineitems = this.lineitems.concat(items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      (this.lineitemsForm.get('lineitems') as FormArray).push(
        this.fb.group({
          id: item.variant.id,
          vendor_name: item.vendor_name,
          product_name: item.title,
          variant_title: item.variant.title,
          image: item.image,
          shipping: item.shipping,
          inventory_quantity: item.variant.inventory_quantity,
          qty: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
          price: item.variant.price,
          sku: item.variant.sku,
        })
      );
    }

    this.updateTotals();
  }

  onQtyChange() {
    this.updateTotals();
  }

  updateTotals() {
    let subTotal = 0;
    let totalShipping = 0;
    for (let i = 0; i < (this.lineitemsForm.get('lineitems') as FormArray).length; i++) {
      const lineItemGroup = (this.lineitemsForm.get('lineitems')['controls'] as FormArray)[i] as FormGroup;
      // Calculate Subtotal
      let price = lineItemGroup.get('price').value;
      let qty = lineItemGroup.get('qty').value;
      if(lineItemGroup.get('qty').valid) {
        subTotal += (price * qty);
      }

      // Calculate Shipping
      let shipping = lineItemGroup.get('shipping').value;
      if(shipping) {
        totalShipping += shipping;
      }
    }
    this.subTotal = subTotal;
    this.totalShipping = totalShipping;

    // Calculate Tax
    this.totalTax = this.taxApplied / 100 * (subTotal + totalShipping);

    // Calculate Grand total
    this.grandTotal = subTotal + totalShipping + this.totalTax;
  }

  ngOnInit(): void {
    this.getTaxConfiguration();
    this.getCustomers();
  }

}
