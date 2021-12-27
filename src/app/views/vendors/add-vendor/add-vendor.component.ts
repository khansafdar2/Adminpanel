import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../vendors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private snackbar: MatSnackBar,
    private router: Router,

  ) { }

  loading: boolean  = false 
  URLS = URLS;
  commission_type_check:any;
  storeCurrency = environment.currency;

  vendorForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.email]],
    phone: [""],
    city: [""],
    address: [""],
    license_number: [null],
    commissions:this.fb.array([]),
    notes: [""],
    is_active: [true],
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
    if(event.value === "percentage") {
      let commission_value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        commission_value_validation.value.updateValueAndValidity();
      }
    } else {
      let commission_value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0)]);
        commission_value_validation.value.updateValueAndValidity();
      }
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
        this.router.navigate(["/", URLS.vendors]);

      }
    });
  }

  ngOnInit(): void {
  }

}
