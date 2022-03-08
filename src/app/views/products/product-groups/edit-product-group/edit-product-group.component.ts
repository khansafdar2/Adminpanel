import { AuthService } from './../../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../../vendors/vendors.service';
import { ContentDisapprovalReasonDialog } from 'src/app/views/content-approval/content-approval.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-product-group',
  templateUrl: './edit-product-group.component.html',
  styleUrls: ['./edit-product-group.component.scss']
})
export class EditProductGroupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private productsService: ProductsService,
    private snackbarService: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog,

  ) {
    this.groupID = this.route.snapshot.paramMap.get("id");
  }

  groupID = null;
  loading: boolean = true;
  is_vendor = this.authService.user.is_vendor;
  URLS = URLS;
  vendors = [];
  approvalStatus: string = '';
  reason: string = '';

  productGroupForm = this.fb.group({
    id: [null],
    title: ['', [Validators.required]],
    vendor: [null, [Validators.required]],
    tat: [""]
  });

  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      this.loading = false;
      if(resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getProductGroupDetails() {
    this.loading = true;
    this.productsService.getProductGroupDetail(this.groupID).then(resp => {
      this.loading = false;
      if(resp) {
        this.productGroupForm.patchValue(resp.data);
        this.approvalStatus = resp.data.status;
        this.reason = resp.data.reason;
      }
    })
  }

  onViewReason() {
    let dialogRef = this.dialog.open(ContentDisapprovalReasonDialog, {
      width: '600px',
      data: {
      reason: this.reason
      }
    });
  }


  onSubmit() {
    this.loading = true;
    this.productsService.updateProductGroup(this.productGroupForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Group updated successfully.", "", {duration: 3000});
      }
    });
  }

  ngOnInit(): void {
    if (!this.is_vendor) {
      this.getVendors();
    }
    this.getProductGroupDetails();
  }

}
