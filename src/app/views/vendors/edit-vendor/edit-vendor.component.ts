import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

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

  loading: boolean = false;
  URLS = URLS;
  vendorID = '';
  vendorDetails:any
  commission_type_check: any;
  storeCurrency = environment.currency;

  vendorForm = this.fb.group({
    id: this.vendorID,
    name: ["", [Validators.required]],
    email: ["", [Validators.email]],
    phone: [""],
    city: [""],
    address: [""],
    license_number: [null],
    commissions: this.fb.array([]),
    notes: [""],
    is_active: [true]
  });


  addCommission() {
    (this.vendorForm.get("commissions") as FormArray).push(
      this.fb.group({
        id:[null],
        title: [""],
        type: ["percentage"],
        value: [0, [Validators.min(0), Validators.max(100)]],
      })
    )
  }


  removeCommission(index) {
    (this.vendorForm.get("commissions") as FormArray).removeAt(index);
  }


  commisionTypeChange(event, index) {
    if (event.value === "percentage") {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('commisssion_value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        value_validation.value.updateValueAndValidity();
      }
    } else {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('commisssion_value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0)]);
        value_validation.value.updateValueAndValidity();
      }
    }
  }


  getSingleVendor() {
    this.loading = true;
    this.vendorsService.getSignleVendor(this.vendorID).then(resp => {
      this.loading = false;
      if (resp) {
        this.vendorDetails = resp.data
        for (let i = 0; i < this.vendorDetails.commissions.length; i++) {
          (this.vendorForm.get("commissions") as FormArray).push(
            this.fb.group({
              id:[null],
              title: [""],
              type: ["percentage"],
              value: [0, [Validators.min(0), Validators.max(100)]],
            })
          )
        }
        this.vendorForm.patchValue(this.vendorDetails);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.vendorsService.updateVendor(this.vendorForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Vendor updated.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.vendors]);
      }
    });
  }

  ngOnInit(): void {
    this.getSingleVendor();
  }

}
