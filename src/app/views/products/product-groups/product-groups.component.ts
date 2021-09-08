import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss']
})
export class ProductGroupsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private productsService: ProductsService) { }

  loading: boolean = true;
  URLS = URLS;
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true
    },
    {
      title: "Vendor",
      selector: "vendor_name"
    },
    {
      title: "Discount",
      selector: "discount_title"
    }
  ]
  productGroups = [];
  rowActions = ["Delete"];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  onCellClick(data) {
    if(data.column === 'title') {
      this.router.navigate(['/', URLS.productGroups, URLS.edit, data.row.id]);
    }
  }

  onRowAction(data) {
    if(data.action === "Delete") {
      let dialogRef = this.dialog.open(DeleteProductGroupDialog, {
        width: "600px",
        data: {
          group: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getProductGroups();
        }
      })
    }
  }

  getProductGroups() {
    this.loading = true;
    this.productsService.getProductGroups(this.pageNumber, this.pageSize, "", "").then(resp => {
      this.loading = false;
      if(resp) {
        this.totalCount = resp.data.count;
        this.productGroups = resp.data.results;
      }
    })
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getProductGroups();
  }

  ngOnInit(): void {
    this.getProductGroups();
  }

}


@Component({
  selector: 'delete-product-group-dialog',
  templateUrl: './dialogs/delete-product-group-dialog.html',
})
export class DeleteProductGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private snackbarService: MatSnackBar
  ) {}

  loading: boolean = true;
  groups = [];
  productGroupForm = this.fb.group({
    group: [null, [Validators.required]]
  });

  getProductGroups() {
    this.productsService.getProductGroups(1, 50, "", "").then(resp => {
      this.loading = false;
      if(resp) {
        this.groups = resp.data.results;
      }
    });
  }

  deleteGroup() {
    this.loading = true;
    this.productsService.deleteProductGroup(this.data.group.id, this.productGroupForm.value.group).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Group deleted successfully.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    this.getProductGroups();
  }

}
