import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

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

  ngOnInit(): void {
  }

}
