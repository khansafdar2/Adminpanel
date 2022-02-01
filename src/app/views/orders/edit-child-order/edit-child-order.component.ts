import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { TaxConfigurationService } from '../../configuration/tax-configuration/tax-configuration.service';
import { OrdersService } from '../orders.service';
import { environment } from 'src/environments/environment';


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
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.orderID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  storeCurrency = environment.currency;
  is_vendor = this.authService.user.is_vendor;
  vendorID = null;
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
  lineitemsFormArray = this.fb.array([]);

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
        this.vendorID = resp.data.vendor;
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
        resp.data.line_items.forEach(lineitem => {
          this.lineitemsFormArray.push(this.fb.group({
            available_quantity: [lineitem.available_quantity],
            deleted: [lineitem.deleted],
            id: [lineitem.id],
            price: [lineitem.price],
            product_image: [lineitem.product_image],
            product_title: [lineitem.product_title],
            quantity: [lineitem.quantity, [Validators.required, Validators.min(1), Validators.max(lineitem.available_quantity)]],
            shipping: [lineitem.shipping],
            subtotal: [lineitem.subtotal],
            variant_title: [lineitem.variant_title],
            variant_id: [lineitem.variant_id]
          }));
        });
      }
    });
  }

  vendorPath(){
    if (!this.is_vendor) {
      this.router.navigate(["/", URLS.orders, URLS.editMainOrder, this.mainOrderID]);
    } else {
      this.router.navigate(["/", URLS.orders]);
    }
  }

  updateTotals() {
    let subTotal = 0;
    let totalShipping = 0;
    for (let i = 0; i < this.lineitemsFormArray.length; i++) {
      const lineItemGroup = (this.lineitemsFormArray['controls'][i] as FormGroup);
      // Calculate Subtotal
      let price = lineItemGroup.get('price').value;
      let quantity = lineItemGroup.get('quantity').value;
      if(lineItemGroup.get('quantity').valid && !lineItemGroup.get('deleted').value) {
        subTotal += (price * quantity);
      }

      // Calculate Shipping
      let shipping = lineItemGroup.get('shipping').value;
      if(shipping && !lineItemGroup.get('deleted').value) {
        totalShipping += parseFloat(shipping);
      }
    }
    this.subTotal = subTotal;
    this.totalShipping = totalShipping;

    // Calculate Grand total
    this.grandTotal = subTotal + totalShipping;
  }

  onAddItems(items) {
    console.log(this.lineitems, items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      this.lineitemsFormArray.push(
        this.fb.group({
          variant_id: item.variant.id,
          product_title: item.title,
          variant_title: item.variant.title,
          deleted: false,
          product_image: item.image,
          shipping: item.shipping,
          available_quantity: item.variant.inventory_quantity,
          quantity: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
          subtotal: item.variant.price,
          price: item.variant.price,
          sku: item.variant.sku,
        })
      );
    }

    this.updateTotals();
  }

  removeLineItem(index) {
    let lineItem = (this.lineitemsFormArray.at(index) as FormGroup).value;
    if(lineItem.id) {
      this.loading = true;
      this.ordersService.deleteLineItem(lineItem.id).then(resp => {
        this.loading = false;
        if(resp) {
          console.log(resp.data);
          (this.lineitemsFormArray.at(index) as FormGroup).patchValue({
            deleted: true
          });
          this.updateTotals();
          this.snackbar.open("Line item deleted.", "", {duration: 2000});
        }
      })
    } else {
      (this.lineitemsFormArray.at(index) as FormGroup).patchValue({
        deleted: true
      });
      this.updateTotals();
      this.snackbar.open("Line item deleted.", "", {duration: 2000});
    }
  }

  onQtyKeydown(event: KeyboardEvent) {
    if(event.key === ".") {
      event.preventDefault();
    }
  }

  onQtyChange() {
    this.updateTotals();
  }

  onSubmit() {
    let lineitems = this.lineitemsFormArray.value.map(lineitem => {
      let obj = {
        id: lineitem.id ? lineitem.id : null,
        quantity: lineitem.quantity,
        variant_id: lineitem.variant_id
      }
      if(!obj.id) {
        delete obj.id;
      }
      return obj;
    });

    let data = {
      id: this.orderID,
      fulfillment_status: this.fulfillmentStatus,
      payment_status: this.paymentStatus,
      notes: this.notes,
      line_items: lineitems,
      tags: this.tags.length ? this.tags.join(",") : ""
    }

    this.loading = true;
    this.ordersService.updateChildOrder(data).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Order updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.orders, URLS.editMainOrder, this.mainOrderID]);
      }
    });
  }

  ngOnInit(): void {
    this.getOrderDetail();
  }

}
