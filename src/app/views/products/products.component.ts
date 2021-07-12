import { SelectionModel } from '@angular/cdk/collections';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { FormControl } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { ProductsService } from './products.service';
import { VendorsService } from './vendors.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private productsService: ProductsService,
    private vendorsService: VendorsService,
    private router: Router) { }

  loading: boolean = false;
  URLS = URLS;
  products = [];
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "image",
      cell: row => `<img src="${row.image ? row.image : '/assets/img/placeholder-image.png'}" class="table-row-thumbnail" />`,
      width: "50px"
    },
    {
      title: "Name",
      selector: "title",
      clickable: true
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
    {
      title: "Inventory",
      selector: "inventory",
    },
    {
      title: "Vendor",
      selector: "vendor_name",
    },
    {
      title: "Type",
      selector: "product_type_name",
    }
  ]
  productSelection: SelectionModel<[]> = new SelectionModel(true, []);
  productFilters = [];
  searchColumns = [
    {
      label: "Name",
      value: "title"
    }
  ];
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;
  filterString: string = "";
  searchString: string = "";

  importProduct() {
    this.dialog.open(ImportProductsDialog, {
      width: "600px"
    });
  }

  bulkChangeStatus() {
    this.dialog.open(ProductsChangeStatusDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });
  }

  bulkChangeApproval() {
    this.dialog.open(ProductsChangeApprovalDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });
  }

  bulkDiscount() {
    this.dialog.open(ApplyBulkDiscountDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });
  }

  bulkTags() {
    this.dialog.open(AddBulkTagsDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });
  }

  bulkChannels() {
    this.dialog.open(ApplyBulkChannelDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });
  }

  getProducts() {
    this.loading = true;
    this.productsService.getProductsList(this.page, this.pageLimit, this.filterString, this.searchString).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.totalCount = resp.data.count;
        this.products = resp.data.results;
      }
    })
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        console.log(resp.data)
        let filters = [
          {
            title: "Status",
            key: 'status',
            values: [
              {
                value: "active",
                label: "Active"
              },
              {
                value: "inactive",
                label: "Inactive"
              }
            ]
          }
        ];
        let vendors = [];
        vendors = resp.data.results.map(vendor => {
          return {
            value: vendor.id,
            label: vendor.name
          }
        });
        console.log(vendors);
        filters.push({
          title: "Vendor",
          key: "vendor",
          values: vendors
        });
        this.productFilters = filters;
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageLimit = event.pageSize;
    this.getProducts();
  }

  onCellClick(data) {
    console.log(data);
    if(data.column === "title") {
      this.router.navigate(["/", URLS.products, URLS.edit, data.row.id]);
    }
  }

  onFilter(filters) {
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if(filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getProducts();
  }

  onSearch(data) {
    let tempSearchString = "";
    if(data.query) {
      tempSearchString += "&search=" + data.query + "&column=" + data.column;
    }
    this.searchString = tempSearchString;
    this.getProducts();
  }


  ngOnInit(): void {
    this.getProducts();
    this.getVendors();
  }
}


@Component({
  selector: 'import-products-dialog',
  templateUrl: './dialogs/import-products-dialog.html'
})
export class ImportProductsDialog {
  constructor(public dialogRef: MatDialogRef<ImportProductsDialog>) {}

  loading: boolean = false;
  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    },
    theme: "dragNDrop",
    multiple: false,
    formatsAllowed: '.csv',
    hideResetBtn: true,
    replaceTexts: {
      dragNDropBox: "Drop file here.",
      uploadBtn: "Upload and continue"
    }
  };
}


@Component({
  selector: 'products-change-status-dialog',
  templateUrl: './dialogs/products-change-status-dialog.html',
})
export class ProductsChangeStatusDialog {
  constructor(public dialogRef: MatDialogRef<ProductsChangeStatusDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;

}


@Component({
  selector: 'products-change-approval-dialog',
  templateUrl: './dialogs/products-change-approval-dialog.html',
})
export class ProductsChangeApprovalDialog {
  constructor(public dialogRef: MatDialogRef<ProductsChangeStatusDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;

}


@Component({
  selector: 'apply-bulk-discount-dialog',
  templateUrl: './dialogs/apply-bulk-discount-dialog.html',
})
export class ApplyBulkDiscountDialog {
  constructor(public dialogRef: MatDialogRef<ProductsChangeStatusDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;

}


@Component({
  selector: 'add-bulk-tags-dialog',
  templateUrl: './dialogs/add-bulk-tags-dialog.html',
})
export class AddBulkTagsDialog {
  constructor(public dialogRef: MatDialogRef<ProductsChangeStatusDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  tagCtrl = new FormControl();
  tagRule: string = "append";


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}


@Component({
  selector: 'apply-bulk-channel-dialog',
  templateUrl: './dialogs/apply-bulk-channel-dialog.html',
})
export class ApplyBulkChannelDialog {
  constructor(public dialogRef: MatDialogRef<ProductsChangeStatusDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;

}