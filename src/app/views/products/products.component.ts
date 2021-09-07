import { SelectionModel } from '@angular/cdk/collections';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { ProductsService } from './products.service';
import { VendorsService } from './vendors.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackbBar: MatSnackBar,
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
    }
  ]
  productSelection: SelectionModel<[]> = new SelectionModel(true, []);
  rowActions = row => {
    let actions = [];
    actions.push(row.is_active ? "Deactivate" : "Activate");
    actions.push("Delete");
    return actions;
  }
  productFilters = [];
  searchColumns = [
    {
      label: "Name",
      value: "title"
    },
    {
      label: "SKU",
      value: "sku"
    }
  ];
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;
  filterString: string = "";
  searchString: string = "";

  importProduct() {
    let dialogRef = this.dialog.open(ImportProductsDialog, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe(imported => {
      if(imported) {
        this.getProducts();
      }
    })
  }

  bulkChangeStatus() {
    let dialogRef = this.dialog.open(ProductsChangeStatusDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if(updated) {
        this.getProducts();
      }
    });
  }

  bulkChangeApproval() {
    let dialogRef = this.dialog.open(ProductsChangeApprovalDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if(updated) {
        this.getProducts();
      }
    });
  }

  bulkTags() {
    let dialogRef = this.dialog.open(AddBulkTagsDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(applied => {
      if(applied) {
        this.productSelection.clear();
      }
    });
  }

  bulkDeleteProduct() {
    let dialogRef = this.dialog.open(ProductsBulkDeleteDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if(deleted) {
        this.getProducts();
      }
    });
  }

  exportProducts() {
    let dialogRef = this.dialog.open(ProductsExportDialog, {
      width: "600px",
      data: {
        products: this.productSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(exported => {
      if(exported) {
        this.productSelection.clear();
      }
    });
  }

  getProducts() {
    this.loading = true;
    this.productSelection.clear();
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
    this.page = 1;
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
    this.page = 1;
    let tempSearchString = "";
    if(data.query) {
      tempSearchString += "&search=" + data.query + "&column=" + data.column;
    }
    this.searchString = tempSearchString;
    this.getProducts();
  }

  onRowAction(data) {
    if(data.action === "Activate" || data.action === "Deactivate") {
      this.loading = true;
      this.productsService.changeProductStatus({
        ids: [data.row.id],
        status: "active",
        value: data.action === "Activate"
      }).then(resp => {
        this.loading = false;
        this.snackbBar.open("Product status updated", "", {duration: 3000});
        this.getProducts();
      });
    } else if(data.action === "Delete") {
      let dialogRef = this.dialog.open(ProductsBulkDeleteDialog, {
        width: "600px",
        data: {
          products: [data.row]
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getProducts();
        }
      });
    }
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
  constructor(
    public dialogRef: MatDialogRef<ImportProductsDialog>,
    private productsService: ProductsService,
    private snackbar: MatSnackBar
  ) {}

  loading: boolean = false;
  fileName = "";
  file: File = null;
  fileError = "";
  // afuConfig = {
  //   uploadAPI: {
  //     url:"https://example-file-upload-api"
  //   },
  //   theme: "dragNDrop",
  //   multiple: false,
  //   formatsAllowed: '.csv',
  //   hideResetBtn: true,
  //   replaceTexts: {
  //     dragNDropBox: "Drop file here.",
  //     uploadBtn: "Upload and continue"
  //   }
  // };
  fileUploading: boolean = false;

  csvFileSelect(event) {
    this.fileError = "";
    let fileObj: File = event.target.files[0];
    let nameArray = fileObj.name.split(".");
    let extension = nameArray[nameArray.length - 1];
    if(extension === "csv") {
      this.file = fileObj;
      this.fileName = fileObj.name;
    } else {
      this.fileError = "Only CSV file supported.";
    }
  }

  onImport() {
    let formData = new FormData;
    formData.append("file", this.file);
    this.loading = true;
    this.productsService.importProducts(formData).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Products imported.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}


@Component({
  selector: 'products-change-status-dialog',
  templateUrl: './dialogs/products-change-status-dialog.html',
})
export class ProductsChangeStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.ids = this.data.products.map(product => product.id);
  }

  loading: boolean = false;
  ids = [];
  activeStatus = ""

  onSubmit() {
    this.loading = true;
    this.productsService.changeProductStatus({
      ids: this.ids,
      status: "active",
      value: this.activeStatus === "Active"
    }).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackBar.open("Products status updated.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}


@Component({
  selector: 'products-change-approval-dialog',
  templateUrl: './dialogs/products-change-approval-dialog.html',
})
export class ProductsChangeApprovalDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeApprovalDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.ids = this.data.products.map(product => product.id);
  }

  loading: boolean = false;
  ids = [];
  approvalStatus = "";

  onSubmit() {
    this.loading = true;
    this.productsService.changeProductStatus({
      ids: this.ids,
      status: "approved",
      value: this.approvalStatus === "Approved"
    }).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackBar.open("Products approval status updated.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}


@Component({
  selector: 'products-bulk-organize-dialog',
  templateUrl: './dialogs/products-bulk-organize-dialog.html',
})
export class ProductsBulkOrganizeDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsBulkOrganizeDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.ids = this.data.products.map(product => product.id);
  }

  loading: boolean = false;
  ids = [];
  productGroups = [];
  organizeForm = this.fb.group({
    product_group: [""],
    collections: [[]]
  });

  getProductGroups

  onSubmit() {
    // this.loading = true;
    // this.productsService.changeProductStatus({
    //   ids: this.ids,
    //   status: "approved",
    //   value: this.approvalStatus === "Approved"
    // }).then(resp => {
    //   this.loading = false;
    //   if(resp) {
    //     this.snackBar.open("Products approval status updated.", "", {duration: 3000});
    //     this.dialogRef.close(true);
    //   }
    // });
  }

  ngOnInit() {

  }
}


@Component({
  selector: 'add-bulk-tags-dialog',
  templateUrl: './dialogs/add-bulk-tags-dialog.html',
})
export class AddBulkTagsDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.ids = this.data.products.map(product => product.id);
  }

  loading: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  tagCtrl = new FormControl();
  tagRule: string = "append";
  ids: number[] = [];


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

  onApply() {
    let data = {
      ids: this.ids,
      status: this.tagRule,
      value: this.tags.join(",")
    }
    this.loading = true;
    this.productsService.applyBulkTags(data).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp);
        this.snackBar.open("Tags applied on selected products.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }
}



@Component({
  selector: 'products-bulk-delete-dialog',
  templateUrl: './dialogs/products-bulk-delete-dialog.html',
})
export class ProductsBulkDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsBulkDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    let idsArray = this.data.products.map(product => product.id);
    this.ids = idsArray.join(",");
  }

  loading: boolean = false;
  ids: string = "";

  onDelete() {
    this.loading = true;
    this.productsService.deleteProducts(this.ids).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackBar.open("Product deleted successfully.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'products-export-dialog',
  templateUrl: './dialogs/products-export-dialog.html',
})
export class ProductsExportDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsExportDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    let idsArray = this.data.products.map(product => product.id);
    this.ids = idsArray.join(",");
  }

  loading: boolean = false;
  ids: string = "";
  exportType = "all";

  onExport() {
    this.loading = true;
    this.productsService.exportProducts(this.exportType === "all" ? "all" : this.ids).then(resp => {
      this.loading = false;
      if(resp) {
        let csv_data = resp.data;
        var fileURL = window.URL.createObjectURL(new Blob([csv_data], { type: 'text/csv;charset=utf-8;' }));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'export_products.csv');
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
        this.dialogRef.close(true);
      }
    });
  }
}
