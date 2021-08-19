import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrdersService } from "../orders.service";

@Component({
  selector: 'payment-method-dialog',
  templateUrl: './PaymentMethodDialog.html'
})
export class PaymentMethodDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PaymentMethodDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private ordersService: OrdersService
  ) {
  }
  
  loading: boolean = false;
  selectedPaymentMethod = null;
  paymentMethod = null;
  
  getPaymentMethods() {
    this.ordersService.getPaymentMethods().then(resp => {
      console.log(resp);
      if(resp) {
        this.paymentMethod = resp.data;
      }
    });
  }

  onSubmit() {
    this.dialogRef.close(this.paymentMethod);
  }

  ngOnInit(): void {
    this.getPaymentMethods();
  }
}
