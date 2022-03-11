import { OrdersService } from './../orders.service';
import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'cancel-order-dialog',
    templateUrl: './cancelOrderDialog.html',
})
export class CancelOrderDialog {
    constructor(
        public dialogRef: MatDialogRef<CancelOrderDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
        private orderService: OrdersService,
        private snackBar: MatSnackBar
    ) { }

    refundStatus = '';
    loading: boolean = false;

    refundOption(event) {
        if (event.value == 'wallet') {
            this.refundStatus = event.value;
        } else if (event.value == 'bank') {
            this.refundStatus = event.value;
        }
    }

    onCancel() {
        let endpoint;
        let mainObj;
        mainObj = {
            id: this.data.id,
            order_status: this.data.order_status,
            refund_status: this.refundStatus
        }
        if (this.data.orderType == 'childOrder') {
            endpoint = "childorder_status_change"
        } else {
            endpoint = "order_status_change"
        }
        this.loading = true;
        this.orderService.changeOrderStatus(mainObj,endpoint).then(resp => {
        this.loading = false;
            if (resp) {
                this.snackBar.open("Order cancelled.", "", { duration: 2000 });
                this.dialogRef.close(true);
            }
        })
    }


    ngOnInit(): void {
        console.log(this.data);
    }
}