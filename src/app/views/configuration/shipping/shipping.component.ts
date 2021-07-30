import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ShippingService } from './shipping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  constructor(
    private shippingService: ShippingService,
    private dialog: MatDialog
  ) { }

  URLS = URLS;
  loading: boolean = true;
  shippingMethods = [];
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: "name",
      clickable: true
    },
    {
      title: "Amount",
      selector: "amount"
    }
  ];
  rowActions = [];

  getShippingMethods() {
    this.loading = true;
    this.shippingService.getShippingMethods(1, 50).then(resp => {
      this.loading = false;
      if(resp) {
        this.shippingMethods = resp.data.results;
      }
    })
  }

  onNewShippingMethod() {
    let dialogRef = this.dialog.open(AddShippingDialog, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe(added => {
      if(added) {
        this.getShippingMethods();
      }
    });
  }

  onCellClick(data) {
    let dialogRef = this.dialog.open(EditShippingDialog, {
      width: "600px",
      data: {
        shipping: data.row
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if(updated) {
        this.getShippingMethods();
      }
    });
  }

  ngOnInit(): void {
    this.getShippingMethods();
  }

}


@Component({
  selector: 'add-shipping-dialog',
  templateUrl: './dialogs/add-shipping-dialog.html',
})
export class AddShippingDialog {
  constructor(
    public dialogRef: MatDialogRef<AddShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) {}

  loading: boolean = false;
  shippingForm = this.fb.group({
    name: ["", [Validators.required]],
    amount: [0, [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  onSubmit() {
    this.loading = true;
    this.shippingService.createShipping(this.shippingForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Shipping method created successfuly.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'edit-shipping-dialog',
  templateUrl: './dialogs/edit-shipping-dialog.html',
})
export class EditShippingDialog {
  constructor(
    public dialogRef: MatDialogRef<EditShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) {
    this.shippingForm.patchValue(data.shipping);
  }

  loading: boolean = false;
  shippingForm = this.fb.group({
    id: [null],
    name: ["", [Validators.required]],
    amount: [0, [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  onSubmit() {
    this.loading = true;
    this.shippingService.updateShipping(this.shippingForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Shipping method updated successfuly.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }
}
