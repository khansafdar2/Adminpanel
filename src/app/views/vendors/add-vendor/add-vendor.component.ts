import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../vendors.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private snackbar: MatSnackBar
  ) { }

  loading: boolean = false;
  URLS = URLS;
  vendorForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.email]],
    phone: [""],
    city: [""],
    address: [""],
    commission_type: ["percentage"],
    commission_value: [0, [Validators.min(0), Validators.max(100)]],
    notes: [""],
    is_active: [true],
    is_approved: [true]
  });

  commisionTypeChange(event) {
    if(event.value === "percentage") {
      (this.vendorForm.get('commission_value') as FormControl).setValidators([Validators.min(0), Validators.max(100)]);
      (this.vendorForm.get('commission_value') as FormControl).updateValueAndValidity();
    } else {
      (this.vendorForm.get('commission_value') as FormControl).setValidators([Validators.min(0)]);
      (this.vendorForm.get('commission_value') as FormControl).updateValueAndValidity();

    }
  }

  onSubmit() {
    console.log(this.vendorForm.value);
    this.loading = true;
    this.vendorsService.createVendor(this.vendorForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.snackbar.open("Vendor created.", "", {duration: 3000});
      }
    });
  }

  ngOnInit(): void {
  }

}
