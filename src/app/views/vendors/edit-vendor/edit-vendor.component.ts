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

  loading: boolean  = false 
  URLS = URLS;
  vendorID = '';
  commission_type_check:any;
  storeCurrency = environment.currency;


  vendorForm = this.fb.group({
    id: this.vendorID,
    name: ["", [Validators.required]],
    email: ["", [Validators.email]],
    phone: [""],
    city: [""],
    address: [""],
    tax: [""],
    commercial_registration: [""],
    commission:this.fb.array([]),
    notes: [""],
    is_active: [true],
    is_approved: [true]
  });




  addCommission() {
    (this.vendorForm.get("commission") as FormArray).push(
       this.fb.group({
        category_name: [""],
        product_group: [[]],
        commission_type: ["percentage"],
        commission_value: [0, [Validators.min(0), Validators.max(100)]],
      })
    )
  }


  removeCommission(index) {
    (this.vendorForm.get("commission") as FormArray).removeAt(index);
  }

  commisionTypeChange(event, index) {
    if(event.value === "percentage") {
      let commission_value_validation = (this.vendorForm.get('commission') as FormArray).at(index).get('commisssion_value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        commission_value_validation.value.updateValueAndValidity();
      }
    } else {
      let commission_value_validation = (this.vendorForm.get('commission') as FormArray).at(index).get('commisssion_value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0)]);
        commission_value_validation.value.updateValueAndValidity();
      }
    }
  }

  suffixType(index){
    return (this.vendorForm.get('commission') as FormArray).at(index).get('commission_type').value;
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
    this.getSingleVendor();

  }

}
