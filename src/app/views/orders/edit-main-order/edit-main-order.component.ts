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
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.orderID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  orderID = "";
  orderTitle = "";
  orderNumber = "";
  orderStatus = "";
  isCancelled = false;
  lineitems = [];
  isPaid: boolean = false;
  fulfillmentStatus: string = "Unfulfilled";
  paymentStatus: string = "Pending";
  subTotal: number = 0;
  totalShipping: number = 0;
  totalTax: number = 0;
  grandTotal: number = 0;
  tags: string[] = [];
  childOrders = [];
  notes: string = "";
  childOrderColumns: Column[] = [
    {
      title: "",
      selector: "name",
      clickable: true
    },
    {
      title: "Vendor",
      selector: "vendor"
    },
    {
      title: "Total",
      selector: "total_price"
    },
    {
      title: "Payment",
      selector: "payment_status",
      label: true,
      labelStyles: {
        "Pending": "default",
        "Paid": "success",
        "Partially Paid": "warning"
      }
    },
    {
      title: "Fulfillment",
      selector: "fulfillment_status",
      label: true,
      labelStyles: {
        "Unfulfilled": "default",
        "Fulfilled": "success",
        "Partially Fulfilled": "warning"
      }
    }
  ]
  customer = {
    id: null,
    name: "",
    email: "",
    phone: ""
  }
  shippingAddress = null;
  billingAddress = null;

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

  getOrderDetails() {
    this.loading = true;
    this.ordersService.getMainOrder(this.orderID).then(resp => {
      this.loading = false;
      if(resp) {
        this.orderTitle = resp.data.name;
        this.orderNumber = resp.data.order_id;
        this.orderStatus = resp.data.order_status;
        this.lineitems = resp.data.line_items;
        this.isPaid = resp.data.payment_status !== "Pending";
        this.isCancelled = resp.data.order_status === "Cancelled";
        this.fulfillmentStatus = resp.data.fulfillment_status;
        this.paymentStatus = resp.data.payment_status;
        this.childOrders = resp.data.child_orders;
        this.subTotal = resp.data.subtotal_price;
        this.totalShipping = resp.data.total_shipping;
        this.grandTotal = resp.data.total_price;
        this.shippingAddress = resp.data.shipping_address.address ? resp.data.shipping_address : null;
        this.billingAddress = resp.data.billing_address.address ? resp.data.billing_address : null;
        this.customer = resp.data.customer;
        this.notes = resp.data.notes;
        this.tags = resp.data.tags ? resp.data.tags.split(",") : [];
      }
    });
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.orders, URLS.editChildOrder, data.row.id]);
  }

  onCancelOrder() {
    let data = {
      id: this.orderID,
      order_status: "Cancelled"
    }
    this.loading = true;
    this.ordersService.changeOrderStatus(data).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Order cancelled.", "", {duration: 3000});
        this.router.navigate(["/", URLS.orders]);
      }
    })
  }

  onSubmit() {
    let data = {
      id: this.orderID,
      fulfillment_status: this.fulfillmentStatus,
      order_status: this.orderStatus,
      payment_status: this.paymentStatus,
      notes: this.notes,
      tags: this.tags.length ? this.tags.join(",") : "",
      shipping_address: this.shippingAddress ? this.shippingAddress : null,
      billing_address: this.billingAddress ? this.billingAddress : null
    }

    this.loading = true;
    this.ordersService.updateMainOrder(data).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Order updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.orders]);
      }
    });
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

}
