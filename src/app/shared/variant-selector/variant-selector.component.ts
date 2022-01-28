import { Component, EventEmitter, Inject, OnInit, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Debounce } from '../utils';
import { VariantSelectorService } from './variant-selector.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'variant-selector',
  templateUrl: './variant-selector.component.html',
  styleUrls: ['./variant-selector.component.scss']
})
export class VariantSelectorComponent implements OnInit {

  @Input() vendor = null;

  @Output() addItems = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog
  ) { }

  openDialog() {
    let dialogRef = this.dialog.open(VariantSelectorDialog, {
      width: "600px",
      data: {
        vendor: this.vendor
      }
    });

    dialogRef.afterClosed().subscribe(selectedVariants => {
      if(selectedVariants) {
        this.addItems.emit(selectedVariants);
      }
    });
  }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'variant-selector-dialog',
  templateUrl: './dialogs/variant-selector-dialog.html',
})
export class VariantSelectorDialog {
  constructor(
    public dialogRef: MatDialogRef<VariantSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private variantSelectorService: VariantSelectorService
  )
  {

  }

  loading: boolean = false;
  searchQuery: string = "";
  selectedVariants = [];
  products = [];
  productsCount = 0;
  pageNumber: number = 1;
  selectedProductsWithVariants = [];
  store_currency = environment.currency;

  getProducts() {
    this.loading = true;
    this.variantSelectorService.getProductsWithVariants(this.pageNumber, 5, this.searchQuery, this.data.vendor).then(resp => {
      this.loading = false;
      if(resp) {
        this.products = this.products.concat(resp.data.results);
        this.productsCount = resp.data.count;
      }
    });
  }

  loadMore() {
    this.pageNumber++;
    this.getProducts();
  }

  onSearch = Debounce(() =>  {
    this.products = [];
    this.pageNumber = 1;
    this.productsCount = 0;
    this.getProducts();
  }, 500);

  compareSelection(o1, o2) {
    return o1.id === o2.id;
  }

  onSelection(e: MatSelectionListChange) {
    let variant = e.options[0].value;
    if(e.options[0].selected) {
      for (let i = 0; i < this.products.length; i++) {
        if(this.products[i].id === variant.product_id) {
          const product = this.products[i];
          let productObj = JSON.parse(JSON.stringify(product));
          delete productObj.variants;
          productObj.variant = variant;
          this.selectedProductsWithVariants.push(productObj);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.selectedProductsWithVariants.length; i++) {
        const product = this.selectedProductsWithVariants[i];
        if(product.variant.id === variant.id) {
          this.selectedProductsWithVariants.splice(i, 1);
          break;
        }
      }
    }
  }

  addItems() {
    this.dialogRef.close(this.selectedProductsWithVariants);
  }

  ngOnInit() {
    this.getProducts();
  }
}
