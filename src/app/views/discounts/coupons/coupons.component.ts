import { CouponService } from './coupons.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private couponService: CouponService
    ) { }

    loading: boolean = false;
    URLS = URLS;
    storeCurrency = environment.currency;
    columns: Column[] = [
      {
        title: "Coupon",
        selector: "unique_id",
        clickable: true
      },
      {
        title: "Value",
        selector: "value"
      },
      {
        title: "Customer",
        selector: "customer_email"
      },
      {
        title: "Expiry date",
        selector: "expiry_date",
        pipe: 'date',
        dateFormat: 'MMM d, h:mm a', 
      }
    ]

    rowActions = ["Delete"]
    discounts = [];
    totalCount: number = 0;
    pageNumber: number = 1;
    pageSize: number = 20;
  
    getCouponList() {
      this.loading = true;
      this.couponService.getCouponsList().then(resp => {
        this.loading = false;
        if(resp) {
          this.discounts = resp.data.results;
          this.totalCount = resp.data.count;
        }
      });
    }
  
    onPageChange(event: PageEvent) {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.getCouponList();
    }
  
    onCellClick(data) {
      this.router.navigate(["/", URLS.coupons, URLS.edit, data.row.id]);
    }
  
    onRowAction(data) {
      if(data.action === "Delete") {
        let dialogRef = this.dialog.open(CouponDeleteDialog, {
          width: "600px",
          data: {
            discount: data.row
          }
        });
  
        dialogRef.afterClosed().subscribe(deleted => {
          if(deleted) {
            this.getCouponList();
          }
        });
      }
    }
  
  
    ngOnInit(): void {
      this.getCouponList();
    }
  
  }
  
  
  @Component({
    selector: 'coupon-delete-dialog',
    templateUrl: '../dialogs/coupon-delete-dialog.html',
  })
  export class CouponDeleteDialog {
    constructor(
      public dialogRef: MatDialogRef<CouponDeleteDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
      private snackBar: MatSnackBar,
      private couponService: CouponService
    ) {}
  
    loading: boolean = false;
  
    onDelete() {
      this.loading = true;
      this.couponService.deleteCoupon(this.data.discount.id).then(resp => {
        if(resp) {
          this.loading = false;
          this.snackBar.open("Coupon deleted.", "", {duration: 2000});
          this.dialogRef.close(true);
        }
      })
    }
  }
  
