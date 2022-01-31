import { ProductsService } from './../../views/products/products.service';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Debounce } from '../utils';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss']
})
export class ProductSelectorComponent implements OnInit {

  @Output() addItems = new EventEmitter<any>();
  @Input() productValue = [];

  constructor(
    private dialog: MatDialog
  ) { }

  openProductSelectorDialog() {
    let dialogRef = this.dialog.open(ProductSelectorDialog, {
      width: "600px",
      data: this.productValue
    });

    dialogRef.afterClosed().subscribe(selectedProducts => {
      if (selectedProducts) {
        this.addItems.emit(selectedProducts);
      }
    });
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'product-selection-dialog',
  templateUrl: './dialogs/product-selector-dialog.html',
})

export class ProductSelectorDialog {

  constructor(
    public dialogRef: MatDialogRef<ProductSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productService: ProductsService
  ) {

  }
  loading: boolean = false;
  searchQuery: string = "";
  products = [];
  productsCount = 0;
  pageNumber: number = 1;
  selectedProducts = [];
  store_currency = environment.currency;

  getProducts() {
    this.loading = true;
    this.productService.getProducts(this.pageNumber, 5, this.searchQuery).then(resp => {
      this.loading = false;
      if (resp) {
        this.products = this.products.concat(resp.data.results);
        this.productsCount = resp.data.count;
      }
    });
  }

  loadMore() {
    this.pageNumber++;
    this.getProducts();
  }

  onSearch = Debounce(() => {
    this.products = [];
    this.pageNumber = 1;
    this.productsCount = 0;
    this.getProducts();
  }, 500);

  compareSelection(o1, o2) {
    return o1.id === o2.id;
  }

  addItems() {
    this.dialogRef.close(this.selectedProducts);
  }

  getSelectedProducts() {
    if (this.data.length > 0) {
      this.selectedProducts = this.data;
    }
  }

  ngOnInit() {
    this.getProducts();
    this.getSelectedProducts();
  }
}
