import { Component, EventEmitter, Inject, OnInit, Output, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Debounce } from '../utils';
// import { VariantSelectorService } from './variant-selector.service';
import { environment } from 'src/environments/environment';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'multi-select-model',
  templateUrl: './multi-select-model.component.html',
  styleUrls: ['./multi-select-model.component.scss']
})

export class MultiSelectModelComponent implements OnInit {

  @Output() addItems = new EventEmitter<any>();
  @Input() btnText = '';
  @Input() endPoints = '';
  @Input() alreadySelectedData = '';

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    debugger 
    // this.buttonText = ''

  }

  buttonText = ''

  openDialog() {
    debugger
    let dialogRef = this.dialog.open(MultiSelectDialog, {
      width: "600px",
      data : {
        heading: this.btnText,
        endPoints : this.endPoints,
        alreadySelectedData: this.alreadySelectedData
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
  selector: 'multi-select-dialog',
  templateUrl: './dialogs/multi-select-dialog.html',
})
export class MultiSelectDialog {
  constructor(
    public dialogRef: MatDialogRef<MultiSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private authService: AuthService
    // private variantSelectorService: VariantSelectorService
  )
  {
    debugger
  }

  dialogHeading = this.data.heading
  dataArray = []
  selectedData = this.data.alreadySelectedData ? this.data.alreadySelectedData : []

  loading: boolean = false;
  searchQuery: string = "";
  selectedVariants = [];
  products = [];
  dataCount = 0;
  pageNumber: number = 1;
  selectedProductsWithVariants = [];
  store_currency = environment.currency;
  limit = 50
  // searchString = ''

  getData() {
    this.loading = true;
    Axios.get( environment.backend_url + this.data.endPoints + '&page=' + this.pageNumber + '&limit=' + this.limit + "&search=" + this.searchQuery + "&column=title", {
      headers: {
        Authorization: this.authService.token
      }
    }).then((resp) => {
      this.dataArray = [...this.dataArray, ...resp.data.results]
      this.dataCount = resp.data.count;
      this.loading = false;
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });

  }

  loadMore() {
    this.pageNumber++;
    this.getData();
  }

  onSearch = Debounce(() =>  {
    debugger
    this.dataArray = [];
    this.pageNumber = 1;
    this.dataCount = 0;
    this.getData();
  }, 500);

  compareSelection(o1, o2) {
    
    return o1.id === o2.id;
  }



  onSelection(e: MatSelectionListChange) {

    debugger
    if(e.options[0].selected) {
      this.selectedData.push(e.options[0].value)
    }
    else 
    {
     let index = this.selectedData.findIndex((obj) => obj.id === e.options[0].value.id)
      this.selectedData.splice(index, 1);
    }
    // let variant = e.options[0].value;
    // if(e.options[0].selected) {
    //   for (let i = 0; i < this.products.length; i++) {
    //     if(this.products[i].id === variant.product_id) {
    //       const product = this.products[i];
    //       let productObj = JSON.parse(JSON.stringify(product));
    //       delete productObj.variants;
    //       productObj.variant = variant;
    //       this.selectedProductsWithVariants.push(productObj);
    //       break;
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < this.selectedProductsWithVariants.length; i++) {
    //     const product = this.selectedProductsWithVariants[i];
    //     if(product.variant.id === variant.id) {
    //       this.selectedProductsWithVariants.splice(i, 1);
    //       break;
    //     }
    //   }
    // }
  }

  addItems() {
    this.dialogRef.close(this.selectedData);
  }

  ngOnInit() {
    debugger
    if (!this.selectedData[0].id)
    {
      this.selectedData = this.selectedData.map(i => { return {id: i } })
    }
    this.getData();
  }
}

