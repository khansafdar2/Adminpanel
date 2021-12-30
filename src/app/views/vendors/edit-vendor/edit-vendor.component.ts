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
    public dialog: MatDialog
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


  onChange(event) {
    this.selected = event.value;
  }

  onSubmit() {
    this.loading = true;
    this.buttonDissabled = true;
    if (this.selected === undefined || this.selected === '') {
      this.vendorsService.deleteCommission(this.commissionID, '').then((resp) => {
        if (resp) {
          this.dialogRef.close(true);
          this.buttonDissabled = true;
          this.snackBar.open("Commission deleted successfully.", "", { duration: 3000 });
        }
      });
    } else {
      this.vendorsService.deleteCommission(this.commissionID, this.selected).then((resp) => {
        if (resp) {
          this.dialogRef.close(true);
          this.buttonDissabled = true;
          this.snackBar.open("Commission assigned and deleted successfully.", "", { duration: 3000 });
        }
      });
    }
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
