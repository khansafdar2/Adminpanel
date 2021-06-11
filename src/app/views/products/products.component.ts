import { SelectionModel } from '@angular/cdk/collections';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { FormControl } from '@angular/forms';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  loading: boolean = false;
  URLS = URLS;
  products = [
    {
      id: 1,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 2,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 3,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 4,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 5,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    }
  ]
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "image_src",
      cell: row => `<img src="${row.image_src}" class="table-row-thumbnail" />`,
      width: "50px"
    },
    {
      title: "Name",
      selector: "name",
    },
    {
      title: "Status",
      selector: "status",
    },
    {
      title: "Inventory",
      selector: "inventory",
    },
    {
      title: "Vendor",
      selector: "vendor",
    },
    {
      title: "Type",
      selector: "type",
    },
    {
      title: "Price",
      selector: "price",
    },
  ]
  productSelection: SelectionModel<[]> = new SelectionModel(true, []);
  productFilters = [
    {
      title: "Status",
      values: ["Active", "Inactive"]
    },
    {
      title: "Type",
      values: ["Simple", "Configurable"]
    }
  ]
  searchColumns = ["Name", "Vendor", "Type"];

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


  ngOnInit(): void {
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