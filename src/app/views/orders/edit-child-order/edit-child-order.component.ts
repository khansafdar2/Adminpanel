import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { CustomerAddressDialog } from '../dialogs/CustomerAddressDialog';
import { OrdersService } from '../orders.service';


@Component({
  selector: 'app-edit-child-order',
  templateUrl: './edit-child-order.component.html',
  styleUrls: ['./edit-child-order.component.scss']
})
export class EditChildOrderComponent implements OnInit {

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
  mainOrderID = "";
  orderTitle = "";
  lineitems = [];
  fulfillmentStatus: string = "Unfulfilled";
  paymentStatus: string = "Pending";
  isPaid: boolean = false;
  subTotal: number = 0;
  totalShipping: number = 0;
  totalTax: number = 0;
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

  getOrderDetail() {
    this.loading = true;
    this.ordersService.getChildOrder(this.orderID).then(resp => {
      this.loading = false;
      if(resp) {
        if(resp.data.customer) {
          this.customer = resp.data.customer;
        }
        this.mainOrderID = resp.data.order;
        this.orderTitle = resp.data.name;
        this.lineitems = resp.data.line_items;
        this.shippingAddress = resp.data.shipping_address.address ? resp.data.shipping_address : null;
        this.billingAddress = resp.data.billing_address.address ? resp.data.billing_address : null;
        this.fulfillmentStatus = resp.data.fulfillment_status;
        this.paymentStatus = resp.data.payment_status;
        this.isPaid = resp.data.payment_status === "Paid";
        this.subTotal = resp.data.subtotal_price;
        this.totalShipping = resp.data.total_shipping;
        this.grandTotal = resp.data.total_price;
        this.notes = resp.data.notes;
        this.tags = resp.data.tags ? resp.data.tags.split(",") : [];
      }
    });
  }

  onSubmit() {
    let data = {
      id: this.orderID,
      fulfillment_status: this.fulfillmentStatus,
      payment_status: this.paymentStatus,
      notes: this.notes,
      tags: this.tags.length ? this.tags.join(",") : ""
    }

    this.loading = true;
    this.ordersService.updateChildOrder(data).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.snackbar.open("Order updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.orders, URLS.editMainOrder, this.mainOrderID]);
      }
    });
  }

  ngOnInit(): void {
    this.getOrderDetail();
  }

}
