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
  orderStatus = "";
  lineitems = [];
  fulfillmentStatus: string = "Unfulfilled";
  paymentStatus: string = "Pending";
  isPaid: boolean = false;
  subTotal: number = 0;
  totalShipping: number = 0;
  totalTax: number = 0;
  grandTotal: number = 0;
  paidByWallet: number = 0;
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
        this.orderStatus = resp.data.order_status;
        this.shippingAddress = resp.data.shipping_address.address ? resp.data.shipping_address : null;
        this.billingAddress = resp.data.billing_address.address ? resp.data.billing_address : null;
        this.fulfillmentStatus = resp.data.fulfillment_status;
        this.paymentStatus = resp.data.payment_status;
        this.isPaid = resp.data.payment_status === "Paid";
        this.paidByWallet = parseFloat(resp.data.paid_amount);
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
            shipping_amount: [lineitem.shipping_amount],
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
      let shipping = lineItemGroup.get('shipping_amount').value;
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
    if (this.lineitemsFormArray.length > 0) {
      for (let i = 0; i < items.length; i++) {
        let idMatch = false;
        const item = items[i];
        for (let j = 0; j < this.lineitemsFormArray.length; j++) {
          const lineItemGroup = (this.lineitemsFormArray['controls'][j] as FormGroup) ;
          let variant_id = lineItemGroup.get('variant_id').value;
          if (item.variant.id == variant_id) {
            idMatch = true
            let qty = lineItemGroup.get('quantity').value;
            qty += 1
            lineItemGroup.get('quantity').patchValue(qty);
          }
        }
        if (!idMatch) {
          (this.lineitemsFormArray.push(
            this.fb.group({
              variant_id: item.variant.id,
              product_title: item.title,
              variant_title: item.variant.title,
              deleted: false,
              product_image: item.image,
              shipping_amount: 0,
              available_quantity: item.variant.inventory_quantity,
              quantity: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
              subtotal: item.variant.price,
              price: item.variant.price,
              sku: item.variant.sku,
            })
          ));
        }
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        (this.lineitemsFormArray.push(
          this.fb.group({
            variant_id: item.variant.id,
            product_title: item.title,
            variant_title: item.variant.title,
            deleted: false,
            product_image: item.image,
            shipping_amount: 0,
            available_quantity: item.variant.inventory_quantity,
            quantity: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
            subtotal: item.variant.price,
            price: item.variant.price,
            sku: item.variant.sku,
          })
        ))
      }
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

  onCancelOrder() {
    let data = {
      id: this.orderID,
      order_status: "Cancelled"
    }
    this.loading = true;
    this.ordersService.changeChildOrderStatus(data).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Order cancelled.", "", {duration: 3000});
        this.router.navigate(["/", URLS.orders]);
      }
    })
  }

  downloadInvoice() {
    this.loading = true;
    this.ordersService.downloadOrderInvoice(this.orderID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp)
        let pdf_data = resp.data;
        var fileURL = window.URL.createObjectURL(new Blob([pdf_data], { type: 'text/pdf;charset=utf-8;' }));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'invoice_'+ this.orderID +'.pdf');
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
      }
    });
  }


  onSubmit() {
    let lineitems = this.lineitemsFormArray.value.map(lineitem => {
      let obj = {
        id: lineitem.id ? lineitem.id : null,
        quantity: lineitem.quantity,
        variant_id: lineitem.variant_id,
        shipping_amount: lineitem.shipping_amount

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
      order_status: this.orderStatus,
      notes: this.notes,
      line_items: lineitems,
      tags: this.tags.length ? this.tags.join(",") : ""
    }

    this.loading = true;
    this.ordersService.updateChildOrder(data).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Order updated.", "", {duration: 3000});
        if (this.is_vendor) {
          this.router.navigate(["/", URLS.orders]);
        } else {
          this.router.navigate(["/", URLS.orders, URLS.editMainOrder, this.mainOrderID]);

        }
      }
    });
  }

  ngOnInit(): void {
    this.getOrderDetail();
  }

}
