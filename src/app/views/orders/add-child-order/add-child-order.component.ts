import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { VendorsService } from '../../vendors/vendors.service';
import { PaymentMethodDialog } from '../dialogs/PaymentMethodDialog';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-add-child-order',
  templateUrl: './add-child-order.component.html',
  styleUrls: ['./add-child-order.component.scss']
})
export class AddChildOrderComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private vendorService: VendorsService,
    private fb: FormBuilder,
    private orderService: OrdersService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.mainOrderID = this.activatedRoute.snapshot.params.mainID;
    this.orderForm.patchValue({
      order_id: this.mainOrderID
    });
  }

  loading: boolean = false;
  URLS = URLS;
  storeCurrency = environment.currency;
  mainOrderID = "";
  vendors = [];
  subTotal: number = 0;
  totalShipping: number = 0;
  totalTax: number = 0;
  grandTotal: number = 0;
  mainOrderName = "";
  paymentMethod = null;
  paymentStatus = null;
  orderForm = this.fb.group({
    order_id: [null],
    vendor: [null, [Validators.required]],
    line_items: this.fb.array([])
  })

  getVendors() {
    this.vendorService.getVendorsList(1, 250).then(resp => {
      if(resp) {
        console.log(resp.data);
        this.vendors = resp.data.results;
      }
    });
  }

  getMainOrder() {
    this.loading = true;
    this.orderService.getMainOrder(this.mainOrderID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.mainOrderName = resp.data.name;
      }
    })
  }

  updateTotals() {
    let subTotal = 0;
    let totalShipping = 0;
    for (let i = 0; i < (this.orderForm.get('line_items') as FormArray).length; i++) {
      const lineItemGroup = ((this.orderForm.get('line_items') as FormArray).at(i) as FormGroup);
      // Calculate Subtotal
      let price = lineItemGroup.get('price').value;
      let quantity = lineItemGroup.get('quantity').value;
      let itemSubTotal = price;
      if(lineItemGroup.get('quantity').valid) {
        subTotal += (price * quantity);
        itemSubTotal = price * quantity;
      }

      // Calculate Shipping
      let shipping = lineItemGroup.get('shipping').value;
      if(shipping) {
        totalShipping += parseFloat(shipping);
      }

      lineItemGroup.patchValue({
        subtotal: itemSubTotal
      });
    }
    this.subTotal = subTotal;
    this.totalShipping = totalShipping;

    // Calculate Grand total
    this.grandTotal = subTotal + totalShipping;
  }

  onAddItems(items) {
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      (this.orderForm.get('line_items') as FormArray).push(
        this.fb.group({
          variant_id: item.variant.id,
          product_title: item.title,
          variant_title: item.variant.title,
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
    (this.orderForm.get('line_items') as FormArray).removeAt(index);
    this.updateTotals();
  }

  onVendorChange() {
    (this.orderForm.get('line_items') as FormArray).clear();
    this.updateTotals();
  }

  onQtyKeydown(event: KeyboardEvent) {
    if(event.key === ".") {
      event.preventDefault();
    }
  }

  onQtyChange() {
    this.updateTotals();
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
    let formValue = this.orderForm.value;
    let mainObject = {
      order: formValue.order_id,
      vendor: formValue.vendor,
      payment_method: this.paymentMethod,
      payment_status: this.paymentStatus,
      line_items: formValue.line_items.map(item => {
        return {
          variant_id: item.variant_id,
          quantity: item.quantity
        }
      })
    }
    this.loading = true;
    this.orderService.createChildOrder(mainObject).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.snackbar.open("Order created.", "", {duration: 2000});
        this.router.navigate(["/", URLS.orders, URLS.editMainOrder, this.mainOrderID]);
      }
    })
  }

  ngOnInit(): void {
    this.getVendors();
    this.getMainOrder();
  }

}
