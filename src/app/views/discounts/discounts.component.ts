import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from './discounts.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {

  constructor(
    private discountsService: DiscountsService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    // {
    //   title: "Type",
    //   selector: "discount_type",
    //   cell: row => row.discount_type === "percentage" ? "Percentage" : "Amount"
    // },
    {
      title: "Discount value",
      selector: "type_value",
      cell: row => row.discount_type === "percentage" ? row.type_value + "%" : row.type_value + " QAR"
    }
  ];
  rowActions = ["Delete"]
  discounts = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getDiscountsList() {
    this.loading = true;
    this.discountsService.getDiscountsList().then(resp => {
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
    this.getDiscountsList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.discounts, URLS.edit, data.row.id]);
  }

  onRowAction(data) {
    if(data.action === "Delete") {
      let dialogRef = this.dialog.open(DiscountDeleteDialog, {
        width: "600px",
        data: {
          discount: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getDiscountsList();
        }
      });
    }
  }

  ngOnInit(): void {
    this.getDiscountsList();
  }

}


@Component({
  selector: 'discount-delete-dialog',
  templateUrl: './dialogs/discount-delete-dialog.html',
})
export class DiscountDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<DiscountDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private discountService: DiscountsService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.discountService.deleteDiscount(this.data.discount.id).then(resp => {
      if(resp) {
        this.snackBar.open("Discount deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}
