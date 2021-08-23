import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { CustomerAddressDialog } from '../dialogs/CustomerAddressDialog';
import { PaymentMethodDialog } from '../dialogs/PaymentMethodDialog';
import { OrdersService } from '../orders.service';


interface Address {
  first_name: string;
  last_name: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  phone: string;
  postal_code: string;
}

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private taxService: TaxConfigurationService,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router
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
  paymentMethod = null;
  paymentStatus = null;
  notes: string = "";
  tags: string[] = [];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  selectedCustomer = null;
  shippingAddress: Address = null;
  billingAddress: Address = null;

  getTaxConfiguration() {
    this.taxService.getTaxInfo().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.taxApplied = resp.data.tax_percentage ? parseFloat(resp.data.tax_percentage) : 0;
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
          vendor: item.vendor_id,
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

  onShippingAddress() {
    let dialogRef = this.dialog.open(CustomerAddressDialog, {
      width: "600px",
      data: {
        title: "Shipping address",
        address: this.shippingAddress
      }
    });

    dialogRef.afterClosed().subscribe(address => {
      if(address) {
        this.shippingAddress = address;
      }
    });
  }

  onBillingAddress() {
    let dialogRef = this.dialog.open(CustomerAddressDialog, {
      width: "600px",
      data: {
        title: "Billing address",
        address: this.billingAddress
      }
    });

    dialogRef.afterClosed().subscribe(address => {
      if(address) {
        this.billingAddress = address;
      }
    });
  }

  changePaymentStatus(status) {
    let dialogRef = this.dialog.open(PaymentMethodDialog, {
      width: "600px",
      data: {
        title: "Payment method"
      }
    });

    dialogRef.afterClosed().subscribe(method => {
      if(method) {
        this.paymentMethod = method;
        this.paymentStatus = status;
      }
    })
  }

  onSubmit() {
    let data:any = {
      customer: this.selectedCustomer,
      notes: this.notes,
      tags: this.tags.join(",")
    };
    let lineitems = [];
    lineitems = this.lineitemsForm.value['lineitems'].map(lineitem => {
      return {
        variant_id: lineitem.id,
        quantity: lineitem.qty,
        vendor: lineitem.vendor
      }
    });
    data.line_items = lineitems;
    if(this.shippingAddress) {
      data.shipping_address = this.shippingAddress;
    }
    if(this.billingAddress) {
      data.billing_address = this.billingAddress;
    }
    if(this.paymentStatus) {
      data.payment_status = this.paymentStatus;
      data.payment_method = this.paymentMethod;
      data.open_order = true;
    } else {
      data.payment_status = null;
      data.payment_method = null;
      data.open_order = false;
    }

    this.ordersService.createOrder(data).then(resp => {
      if(resp) {
        this.snackbar.open("Order created successfully", "", {duration: 3000});
        if(data.open_order) {
          this.router.navigate(['/', URLS.orders]);
        } else {
          this.router.navigate(['/', URLS.draftOrders]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getTaxConfiguration();
    this.getCustomers();
  }

}
