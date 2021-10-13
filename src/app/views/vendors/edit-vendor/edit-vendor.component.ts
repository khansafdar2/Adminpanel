import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar

  ) {
    this.vendorID = this.route.snapshot.paramMap.get('id');
   }

  loading: boolean  = false 
  URLS = URLS;
  vendorID = '';
  vendorName = ''
  vendorEmail = ''
  vendorPhone = ''
  vendorCity = ''
  vendorAddress = ''
  commissionType = ''
  commissionValue = ''
  vendorStatus = ''
  notes = ''

  vendorForm = this.fb.group({
    id: this.vendorID,
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
  getSingleVendor() {
    this.loading = true;
    this.vendorsService.getSignleVendor(this.vendorID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp)
        this.vendorForm.patchValue(resp.data)
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.vendorsService.updateVendor(this.vendorForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Vendor updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.vendors]);
      }
    });
  }

  ngOnInit(): void {
    this.getSingleVendor()
  }

}
