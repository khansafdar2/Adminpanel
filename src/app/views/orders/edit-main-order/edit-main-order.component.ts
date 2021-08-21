import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
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
    private route: ActivatedRoute
  ) {
    this.orderID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  orderID = "";
  lineitems = [];
  fulfillmentStatus: string = "Unfulfilled";
  paymentStatus: string = "Pending";
  subTotal: number = 0;
  totalShipping: number = 0;
  totalTax: number = 0;
  grandTotal: number = 0;
  tags: string[] = [];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
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
        "Paid": "success"
      }
    },
    {
      title: "Fulfillment",
      selector: "fulfillment_status",
      label: true,
      labelStyles: {
        "Unfulfilled": "default",
        "Fulfilled": "success"
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
        console.log(resp.data);
        this.lineitems = resp.data.line_items;
        this.fulfillmentStatus = resp.data.fulfillment_status;
        this.paymentStatus = resp.data.payment_status;
        this.childOrders = resp.data.child_orders;
        this.subTotal = resp.data.subtotal_price;
        this.totalShipping = resp.data.total_shipping;
        this.grandTotal = resp.data.total_price;
        this.shippingAddress = resp.data.shipping_address;
        this.billingAddress = resp.data.billing_address.address ? resp.data.billing_address : null;
        this.customer = {
          id: resp.data.customer_id,
          name: resp.data.customer_name,
          phone: resp.data.customer_phone,
          email: resp.data.customer_email
        }
        this.notes = resp.data.notes;
        this.tags = resp.data.tags.split(",");
      }
    });
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getOrderDetails();
  }

}
