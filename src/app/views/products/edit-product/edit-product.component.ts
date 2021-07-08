import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute } from '@angular/router';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsChangeStatusDialog } from '../products.component';

interface Variant {
  id: number,
  title: string;
  price: number,
  sku: string,
  compare_at_price: number;
  option1: string;
  option2: string;
  option3: string;
  inventory_quantity: number;
  barcode: string;
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private collectionsService: CollectionsService,
    private vendorsService: VendorsService,
    private brandsService: BrandsService,
    private sharedService: SharedService,
    private snackbarService: MatSnackBar
  ) {
    this.productID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  productID: string;
  productTypes: any[] = [];
  productGroups: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  brands: any[] = [];
  bannerImages = [];
  productOptions = [];
  variants: Variant[] = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  afuConfig = {
    uploadAPI: this.sharedService.afuUploadAPI,
    theme: "dragNDrop",
    multiple: true,
    formatsAllowed: '.jpg,.jpeg,.png',
    hideResetBtn: true,
    replaceTexts: {
      selectFileBtn: "Select images",
      dragNDropBox: "Drop images here.",
      uploadBtn: "Upload and save"
    }
  };
  productForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required]],
    description: ["", []],
    features: this.fb.array([]),
    product_images: [[]],
    product_type: [null],
    product_group: [null, [Validators.required]],
    product_brand: [null],
    collection: [[]],
    vendor: [null],
    is_active: [false],
    hide_out_of_stock: [false],
    apply_shipping: [false],
    apply_tax: [false],
    has_variants: [false]
  });

  inventoryForm = this.fb.group({
    sku: [""],
    barcode: [null],
    inventory_quantity: [0],
    track_inventory: [false]
  });

  priceForm = this.fb.group({
    price: [0],
    compare_at_price: [0]
  });

  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        feature_title: [''],
        feature_details: ['']
      })
    )
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
  }

  mediaUpload(response) {
    console.log(response);
    if(response.status === 200) {
      this.bannerImages = response.body;
      let imageIDs = response.body.map(image => image.id);
      this.productForm.patchValue({
        product_images: imageIDs
      });
    }
  }

  removeImage(index) {
    this.bannerImages.splice(index, 1);
    let imageIDs = this.productForm.get('product_images').value;
    imageIDs.splice(index, 1);
    this.productForm.patchValue({
      product_images: imageIDs
    });
  }

  getProductTypes() {
    this.productsService.getProductTypes().then(resp => {
      if(resp) {
        this.productTypes = resp.data;
      }
    });
  }

  getProductGroups() {
    this.productsService.getProductGroups(1, 50, "", "").then(resp => {
      if(resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getCollections() {
    this.collectionsService.getCollectionsList(1, 50, "", "").then(resp => {
      if(resp) {
        this.collections = resp.data.results;
      }
    })
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getBrands() {
    this.brandsService.getBrandsList(1, 50).then(resp => {
      if(resp) {
        this.brands = resp.data.results;
      }
    });
  }

  getProductDetails() {
    this.loading = true;
    this.productsService.getProductDetail(this.productID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        for (let i = 0; i < resp.data.features.length; i++) {
          this.addFeature();
        }
        this.bannerImages = resp.data.images;
        this.productForm.patchValue(resp.data);
        this.productOptions = resp.data.options;
        this.variants = resp.data.variants;
      }
    });
  }

  deleteVariant(variant) {
    let dialogRef = this.dialog.open(DeleteVariantConfirmDialog, {
      width: "600px",
      data: {
        variant
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.loading = true;
        this.productsService.deleteVariant(data.id).then(resp => {
          this.loading = false;
          if(resp) {
            console.log(resp.data);
            this.snackbarService.open("Variant deleted successfuly.", "", {duration: 3000});
            if(resp.data.detail === "Deleted Variant Successfully!") {
              this.variants = this.variants.filter(variant => variant.id !== data.id);

              if(this.variants.length === 0) {
                this.productForm.patchValue({
                  has_variants: false
                });
              }
            }
          }
        });
      }
    });
  }

  onEditOptions() {
    this.dialog.open(EditProductOptionsDialog, {
      width: '600px',
      data: {
        options: this.productOptions,
        variants: this.variants
      }
    })
  }

  ngOnInit(): void {
    this.getProductTypes();
    this.getProductGroups();
    this.getCollections();
    this.getVendors();
    this.getBrands();
    this.getProductDetails();
  }

}


@Component({
  selector: 'delete-variant-confirm-dialog',
  templateUrl: '../dialogs/delete-variant-confirm-dialog.html',
})
export class DeleteVariantConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  loading: boolean = false;

  deleteVariant() {
    this.dialogRef.close(this.data.variant);
  }

}


@Component({
  selector: 'edit-product-options-dialog',
  templateUrl: '../dialogs/edit-product-options-dialog.html',
})
export class EditProductOptionsDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar) {
      this.originalOptions = this.data.options.map(option => {
        let tempOption = Object.assign({}, option);
        tempOption.values = option.values.split(",");
        return tempOption;
      });

      this.options = Object.assign([], this.originalOptions);
      let tempVariants = this.data.variants.map(variant => Object.assign({}, variant));
      this.editingVariants = Object.assign([], tempVariants);
  }

  loading: boolean = false;
  originalOptions = [];
  options = [];
  editingVariants = [];
  deletedVariants = [];

  deleteVariant() {

  }

  removeValue(optionIndex, valueIndex) {
    let value = this.options[optionIndex].values[valueIndex];
    if(this.options[optionIndex].values.length === 1) {
      // let deletedOption = Object.assign({}, this.options[optionIndex]);
      this.options.splice(optionIndex, 1);
      // let originalOption = this.originalOptions.find(obj => obj.id === deletedOption.id);
      this.removeOptionFromVariants(optionIndex);
      // if(originalOption.values.length === 1) {
      // }
    } else {
      this.options[optionIndex].values.splice(valueIndex, 1);
      this.deleteVariantsFromOption(optionIndex, value);
    }
  }

  removeOptionFromVariants(index) {
    for (let i = 0; i < this.editingVariants.length; i++) {
      const editingVariant = this.editingVariants[i];
      editingVariant['option' + (index+1)] = null;
      if(index < 2) {
        for (let j = index+1; j < 3; j++) {
          editingVariant['option' + j] = editingVariant['option' + (j+1)];
        }
      }
      
    }

    console.log(this.editingVariants);
  }

  deleteVariantsFromOption(optionIndex, value) {
    let tempVariants = [];
    this.editingVariants.forEach(variant => {
      if(variant['option' + (optionIndex+1)] === value) {
        this.deletedVariants.push(variant);
      } else {
        tempVariants.push(variant);
      }
    });
    this.editingVariants = tempVariants;
    console.log(this.editingVariants);
  }
}
