import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { concat, Observable, of, Subject } from 'rxjs';
// import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { CustomerAddressDialog } from '../dialogs/CustomerAddressDialog';
import { PaymentMethodDialog } from '../dialogs/PaymentMethodDialog';
import { OrdersService } from '../orders.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-edit-draft-order',
  templateUrl: './edit-draft-order.component.html',
  styleUrls: ['./edit-draft-order.component.scss']
})
export class EditDraftOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private taxService: TaxConfigurationService,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.orderID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  storeCurrency = environment.currency;
  is_vendor = this.authService.user.is_vendor;
  orderID = "";
  orderTitle = "";
  lineitems = [];
  isPaid: boolean = false;
  paymentMethod = null;
  paymentStatus = null;

  subTotal: number = 0;
  totalShipping: number = 0;
  grandTotal: number = 0;

  tags: string[] = [];
  notes: string = "";
  customer = {
    id: null,
    name: "",
    email: "",
    phone: ""
  }
  shippingAddress = null;
  billingAddress = null;

  getOrderDetails() {
    this.loading = true;
    this.ordersService.getDraftOrder(this.orderID).then(resp => {
      this.loading = false;
      if(resp) {
        this.orderTitle = resp.data.name;
        this.lineitems = resp.data.lineitems;
        this.paymentStatus = resp.data.payment_status;
        this.subTotal = resp.data.subtotal_price;
        this.totalShipping = resp.data.total_shipping;
        this.grandTotal = resp.data.total_price;
        this.shippingAddress = resp.data.shipping_address.address ? resp.data.shipping_address : null;
        this.billingAddress = resp.data.billing_address.address ? resp.data.billing_address : null;
        this.customer = resp.data.customer;
        this.notes = resp.data.notes;
        this.tags = resp.data.tags ? resp.data.tags.split(",") : [];

        this.updateTotals();
      }
    });
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

  updateTotals() {
    let subtotal = 0;
    let totalShipping = 0;
    let grandTotal = 0;

    for (let i = 0; i < this.lineitems.length; i++) {
      const lineItem = this.lineitems[i];
      subtotal += lineItem.subtotal;
      if(lineItem.shipping_amount) {
        totalShipping += parseFloat(lineItem.shipping_amount);
      }
    }

    grandTotal = subtotal + totalShipping;

    this.subTotal = subtotal;
    this.totalShipping = totalShipping;
    this.grandTotal = grandTotal;
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
      id: this.orderID,
      customer: this.customer ? this.customer.id : null,
      notes: this.notes,
      tags: this.tags.join(",")
    };
    let lineitems = [];
    lineitems = this.lineitems.map(lineitem => {
      return {
        variant_id: lineitem.variant,
        quantity: lineitem.quantity,
        vendor: lineitem.vendor,
        shipping_amount: lineitem.shipping_amount
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

    this.loading = true;
    this.ordersService.updateDraftOrder(data).then(resp => {
      this.loading = false;
      if(resp) {
        if(data.open_order) {
          this.router.navigate(['/', URLS.orders]);
          this.snackbar.open("Order created successfully", "", {duration: 3000});
        } else {
          this.router.navigate(['/', URLS.draftOrders]);
          this.snackbar.open("Order updated successfully", "", {duration: 3000});
        }
      }
    });
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

}
