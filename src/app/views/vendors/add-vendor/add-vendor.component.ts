import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../vendors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedService } from '../../../shared/shared.service';



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
    private sharedService: SharedService

  ) { }

  loading: boolean  = false 
  URLS = URLS;
  commission_type_check:any;
  storeCurrency = environment.currency;

  nationalIdURL: string = "";
  nationalId_document_uploading: boolean = false;

  tradelicenseURL: string = "";
  tradelicense_document_uploading: boolean = false;

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
    is_approval: [false],
    product_approval: [false],
    product_group_approval: [false],
    collection_approval: [false],
    discount_approval: [false],
    shipping_approval: [false],
    national_id: [null],
    trade_license: [null],
  });



  selectNationalIdDocument(e) {
    const file = e.target.files[0];
    this.nationalId_document_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.nationalId_document_uploading = false;
      if (resp) {
        this.nationalIdURL = resp.data[0].cdn_link;
        this.vendorForm.patchValue({
          national_id: this.nationalIdURL
        });
        e.target.value = "";
      }
    });
  }

  selectTradeLicenseDocument(e) {
    const file = e.target.files[0];
    this.tradelicense_document_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.tradelicense_document_uploading = false;
      if (resp) {
        this.tradelicenseURL = resp.data[0].cdn_link;
        console.log("TradeLicence URL:", this.tradelicenseURL);
        this.vendorForm.patchValue({
          trade_license: this.tradelicenseURL
        });
        e.target.value = "";
      }
    });
  }

  removeNationalIdDocument() {
    this.nationalIdURL = "";
    this.vendorForm.patchValue({
      national_id: null
    });
  }

  removeTradeLicenseDocument() {
    this.tradelicenseURL = "";
    this.vendorForm.patchValue({
      trade_license: null
    });
  }




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


  unSelectAllApprovals(event:MatCheckboxChange){
    if(!event.checked) {
        this.vendorForm.get('product_approval').setValue(false)
        this.vendorForm.get('product_group_approval').setValue(false)
        this.vendorForm.get('collection_approval').setValue(false)
        this.vendorForm.get('discount_approval').setValue(false)
        this.vendorForm.get('shipping_approval').setValue(false)
    }
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
