import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'customer-address-dialog',
  templateUrl: './CustomerAddressDialog.html'
})
export class CustomerAddressDialog {
  constructor(
    public dialogRef: MatDialogRef<CustomerAddressDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    if(this.data.address) {
      this.addressForm.patchValue(this.data.address);
    }
  }

  loading: boolean = false;
  addressForm = this.fb.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    address: ["", [Validators.required]],
    apartment: [""],
    company: [""],
    city: ["", [Validators.required]],
    country: ["", [Validators.required]],
    phone: ["", [Validators.required]],
    postal_code: ["", [Validators.required]]
  })

  onSubmit() {
    this.dialogRef.close(this.addressForm.value);
  }
}
