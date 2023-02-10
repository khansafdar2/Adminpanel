import { MatCheckboxChange } from '@angular/material/checkbox';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductsService } from './../../products/products.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../../shared/shared.service';


@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private sharedService: SharedService

  ) {
    this.vendorID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = false;
  URLS = URLS;
  vendorID = '';
  vendorDetails: any
  commission_type_check: any;
  is_vendor = this.authService.user.is_vendor;
  storeCurrency = environment.currency;

  nationalIdURL: string = "";
  nationalId_document_uploading: boolean = false;

  tradelicenseURL: string = "";
  tradelicense_document_uploading: boolean = false;

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


  addCommission() {
    (this.vendorForm.get("commissions") as FormArray).push(
      this.fb.group({
        title: [""],
        type: ["percentage"],
        value: [0, [Validators.min(0), Validators.max(100)]],
      })
    )
  }


  removeCommission(index) {
    let commissionID = (this.vendorForm.get("commissions") as FormArray).at(index).get('id').value;
    let dialogRef = this.dialog.open(DeleteCommissionDialog, {
      width: "600px",
      data: {
        commissionID: commissionID,
        vendorID: this.vendorID
      }
    });
    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.removeCommissionAfterConfirmation(index);
      }
    });
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


  removeCommissionAfterConfirmation(index) {
    (this.vendorForm.get("commissions") as FormArray).removeAt(index);
  }


  commisionTypeChange(event, index) {
    if (event.value === "percentage") {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        value_validation.value.updateValueAndValidity();
      }
    } else {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0)]);
        value_validation.value.updateValueAndValidity();
      }
    }
  }


  fetchSingleVendor() {
    this.loading = true;
    this.vendorsService.getSignleVendor(this.vendorID).then(resp => {
      this.loading = false;
      if (resp) {
        this.vendorDetails = resp.data
        let national_id = resp.data.national_id;
        let trade_license = resp.data.trade_license;


        if (national_id) {
          this.nationalIdURL = national_id;
        }
        
        if (trade_license) {
          this.tradelicenseURL = trade_license;
        }
        for (let i = 0; i < this.vendorDetails.commissions.length; i++) {
          (this.vendorForm.get("commissions") as FormArray).push(
            this.fb.group({
              id: [null],
              title: [{value:'', disabled:this.is_vendor}],
              type: [{value:'percentage', disabled:this.is_vendor}],
              value: [{value:0, disabled:this.is_vendor}, [Validators.min(0), Validators.max(100)]],
            })
          )
        }
        this.vendorForm.patchValue(this.vendorDetails);
      }
    });
  }

  
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
    this.fetchSingleVendor();
  }
}


@Component({
  selector: 'delete-commission-dialog',
  templateUrl: '../dialogs/delete-commission-dialog.html',
})
export class DeleteCommissionDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteCommissionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private vendorsService: VendorsService,
    private snackBar: MatSnackBar,
    private commissionService: ProductsService,
    private fb: FormBuilder,

  ) {
    this.vendorID = this.data.vendorID
  }

  commissionList = [];
  vendorID = '';
  loading = false;
  buttonDissabled = false;
  selected: any;
  commissionID = this.data.commissionID;


  commissionDeleteForm = this.fb.group({
    commission: [''],
  });


  onSubmit() {
    this.loading = true;
    let selectedValue = (this.commissionDeleteForm.get('commission').value)
      this.vendorsService.deleteCommission(this.commissionID, selectedValue).then((resp) => {
        this.loading = false;
        if (resp) {
          this.dialogRef.close(true);
          this.snackBar.open("Commission deleted.", "", { duration: 3000 });
        }
      });
  }

  getCommissions() {
    this.commissionService.getCommissions(this.data.vendorID).then(resp => {
      if (resp) {
        this.commissionList = resp.data
      }
    })
  }


  ngOnInit(): void {
    this.getCommissions();
  }
}
