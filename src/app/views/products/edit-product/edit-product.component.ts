import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
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
  is_physical: boolean;
  weight: number;
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
    private snackbarService: MatSnackBar,
    private router: Router
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
  deletedVariants: Variant[] = [];
  deletedImages = [];
  originalPrice = 0;
  originalOptions = [];
  changingPrice: boolean = false;
  originalVariants: Variant[] = [];
  creatingVariants: boolean = false;
  productTags: string[] = [];
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
    product_group: [""],
    product_brand: [null],
    collection: [[]],
    vendor: [null, [Validators.required]],
    is_active: [{value: false, disabled: true}],
    hide_out_of_stock: [false],
    has_variants: [false],
    track_inventory: [true],
    warranty: [""],
    tags: [""]
  });

  inventoryForm = this.fb.group({
    sku: ["", Validators.required],
    barcode: [null],
    inventory_quantity: [0],
    track_inventory: [false],
    is_physical: [true],
    weight: [0.1, [Validators.required, Validators.min(0.1)]]
  });

  priceForm = this.fb.group({
    price: [0],
    compare_at_price: [0]
  });

  variantsForm = this.fb.group({
    variants: this.fb.array([])
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
    this.deletedImages.push(imageIDs[index]);
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
    let vendor = this.productForm.get('vendor').value;
    this.productsService.getProductGroups(1, 50, "&vendor=" + vendor, "").then(resp => {
      if(resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getCollections() {
    let vendor = this.productForm.get('vendor').value;
    this.collectionsService.getCollectionsList(1, 50, "&vendor=" + vendor, "").then(resp => {
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
        resp.data.product_images = this.bannerImages.map(image => image.id);
        this.productTags = resp.data.tags.split(",");
        this.productForm.patchValue(resp.data);
        this.getProductGroups();
        this.getCollections();
        if(resp.data.product_group) {
          (this.productForm.controls['is_active'] as FormControl).enable();
        }
        this.variants = resp.data.variants;
        if(resp.data.has_variants) {
          this.productOptions = resp.data.options;
          this.originalOptions = resp.data.options;
          this.originalVariants = resp.data.variants;

          this.inventoryForm.controls['sku'].clearValidators();
          this.inventoryForm.controls['sku'].updateValueAndValidity();
        } else {
          let variant = resp.data.variants[0];
          this.originalPrice = variant.price;
          this.inventoryForm.patchValue({
            barcode: variant.barcode,
            inventory_quantity: variant.inventory_quantity,
            sku: variant.sku,
            is_physical: variant.is_physical,
            weight: variant.weight
          });
          this.priceForm.patchValue({
            price: variant.price,
            compare_at_price: variant.compare_at_price
          });
        }
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
              this.productOptions = Object.assign([], this.originalOptions);
              this.variants = this.originalVariants.filter(variant => {
                return variant.id !== data.id
              });

              if(this.variants.length === 0) {
                this.productForm.patchValue({
                  has_variants: false
                });
              }
            } else if(resp.data.variants) {
              let variant = resp.data.variants[0];

              this.productForm.patchValue({
                has_variants: false
              });
              this.inventoryForm.patchValue({
                barcode: variant.barcode,
                inventory_quantity: variant.inventory_quantity,
                sku: variant.sku
              });
              this.priceForm.patchValue({
                price: variant.price,
                compare_at_price: variant.compare_at_price
              });

              this.productOptions = [];
              this.variants = [];
            }
          }
        });
      }
    });
  }

  onEditOptions() {
    let dialogRef = this.dialog.open(EditProductOptionsDialog, {
      width: '600px',
      data: {
        options: this.productOptions,
        variants: this.variants
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        console.log(data);
        this.variants = data.variants;
        this.deletedVariants = data.deletedVariants;
        this.productOptions = data.options.map(option => {
          let tempOption = option;
          tempOption.values = tempOption.values.join(",");
          return tempOption;
        });
      }
    });
  }

  hasVariantsChange(event) {
    if(event.checked) {
      this.creatingVariants = true;
      this.addOption();


      (this.inventoryForm.controls['sku'] as FormControl).clearValidators();
      (this.inventoryForm.controls['sku'] as FormControl).updateValueAndValidity();

      for (let i = 0; i < (this.variantsForm.controls['variants'] as FormArray).controls.length; i++) {
        const variantGroup = (this.variantsForm.controls['variants'] as FormArray).controls[i] as FormGroup;
        variantGroup.controls['sku'].setValidators([Validators.required]);
        variantGroup.controls['sku'].updateValueAndValidity();
      }
    } else {
      (this.inventoryForm.controls['sku'] as FormControl).setValidators([Validators.required]);

      for (let i = 0; i < (this.variantsForm.controls['variants'] as FormArray).controls.length; i++) {
        const variantGroup = (this.variantsForm.controls['variants'] as FormArray).controls[i] as FormGroup;
        variantGroup.controls['sku'].setValidators([]);
        variantGroup.controls['sku'].updateValueAndValidity();
      }
    }
  }

  addOption() {
    this.productOptions.push({
      name: "",
      values: []
    });
  }

  deleteOption(index) {
    this.productOptions.splice(index, 1);
    this.makeVariantsFromOptions();
  }

  makeVariantsFromOptions() {
    var valuesArrays = this.productOptions.map(option => option.values);

    var combinations = this.sharedService.makeCombinationsFromLists(...valuesArrays);
    (this.variantsForm.get('variants') as FormArray).clear();
    combinations.forEach(title => {

      let variant = this.fb.group({
        title: [title],
        price: [this.priceForm.get('price').value],
        compare_at_price: [this.priceForm.get('compare_at_price').value],
        inventory_quantity: [this.inventoryForm.get('inventory_quantity').value],
        option1: [title.split("/")[0] || null],
        option2: [title.split("/")[1] || null],
        option3: [title.split("/")[2] || null],
        sku: [this.inventoryForm.get('sku').value, [Validators.required]],
        barcode: [this.inventoryForm.get('barcode').value],
        is_physical: [true],
        weight: [0.1]
      });

      (this.variantsForm.get('variants') as FormArray).push(variant);
    });
  }

  removeVariant(index) {
    (this.variantsForm.get('variants') as FormArray).removeAt(index);
  }

  onVendorChange() {
    this.productForm.patchValue({
      product_group: "",
      collection: []
    });
    this.getProductGroups();
    this.getCollections();
  }

  onProductGroupChange() {
    let group = this.productForm.get('product_group').value;
    if(!group) {
      this.productForm.patchValue({
        is_active: false
      });
      (this.productForm.controls['is_active'] as FormControl).disable();
    } else {
      (this.productForm.controls['is_active'] as FormControl).enable();
    }
    this.checkPriceChange()
  }

  onPysicalChange(event) {
    if(event.checked) {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
    } else {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([]);
      this.inventoryForm.patchValue({
        weight: 0.1
      });
    }
    if(this.creatingVariants) {
      let variants = this.variantsForm.value.variants;
      for (let i = 0; i < variants.length; i++) {
        variants[i].is_physical = event.checked;
      }
      this.inventoryForm.patchValue({
        variants
      });
    } else {
      this.variants[0].is_physical = event.checked;
    }
  }

  onWeightChange() {
    if(this.creatingVariants) {
      let variants = this.variantsForm.value.variants;
      for (let i = 0; i < variants.length; i++) {
        variants[i].weight = this.inventoryForm.get('weight').value;
      }
      console.log(variants);
      this.variantsForm.patchValue({
        variants
      });
    } else {
      this.variants[0].weight = this.inventoryForm.get('weight').value;
    }
  }

  checkPriceChange() {
    let selectedGroup = this.productForm.get('product_group').value;
    let discountApplied: boolean = false;

    if(selectedGroup) {
      for (let i = 0; i < this.productGroups.length; i++) {
        if(this.productGroups[i].id == selectedGroup) {
          discountApplied = this.productGroups[i].discount !== null;
          break;
        }
      }

      if(discountApplied) {
        if(this.originalPrice != this.priceForm.get('price').value) {
          this.changingPrice = true;
        } else {
          this.changingPrice = false;
        }
      }
    }
  }

  onSubmit() {
    let variants = [];
    let productData = this.productForm.value;
    let optionsData = this.productOptions;
    if(this.creatingVariants) {
      variants = this.variantsForm.value.variants;
    } else {
      variants = this.variants;
    }
    if(!productData.has_variants) {
      variants[0].price = this.priceForm.get('price').value;
      variants[0].compare_at_price = this.priceForm.get('compare_at_price').value;
      variants[0].sku = this.inventoryForm.get('sku').value;
      variants[0].barcode = this.inventoryForm.get('barcode').value;
      variants[0].inventory_quantity = this.inventoryForm.get('inventory_quantity').value;
    }

    if(this.changingPrice) {
      productData.product_group = "";
    }

    productData.options = optionsData;
    productData.variants = variants;
    productData.deleted_variants_id = this.deletedVariants.map(variant => variant.id);
    productData.deleted_product_images = this.deletedImages;

    this.loading = true;
    this.productsService.updateProduct(productData).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.snackbarService.open("Product updated successfuly.", "", {duration: 3000});
        this.router.navigate(["/", URLS.products]);
      }
    });
  }

  ngOnInit(): void {
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
  confirmingDelete: boolean = false;
  formError: string = "";

  canRemoveValue() {
    if(this.options.length > 1) {
      return true;
    } else {
      return this.options[0].values.length > 1;
    }
  }

  removeValue(optionIndex, valueIndex) {
    let value = this.options[optionIndex].values[valueIndex];
    if(this.options[optionIndex].values.length === 1) {
      this.options.splice(optionIndex, 1);
      this.removeOptionFromVariants(optionIndex);
      // if(this.options.length === 0) {

      // } else {
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
        editingVariant['option3'] = null;
      }
      this.editingVariants.forEach(variant => {
        let variantTitle = [];
        this.options.forEach((option, index) => {
          let optionValue = variant['option' + (index+1)];
          variantTitle.push(optionValue);
        });
        variant.title = variantTitle.join("/");
      });
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

  addOption() {
    this.options.push({
      name: "",
      new: true,
      values: [""]
    });
  }

  addNewOptionValue(e, optionIndex) {
    console.log(e);
    var value = e.target.value;
    if(value) {
      this.editingVariants.forEach(variant => {
        let variantTitle = [];
        variant['option' + (optionIndex + 1)] = value;
        this.options.forEach((option, index) => {
          variantTitle.push(variant['option' + (index + 1)]);
        });
        variant.title = variantTitle.join("/");
      });
    } else {
      if(this.options.length > 1) {
        this.options.splice(optionIndex, 1);
        this.removeOptionFromVariants(optionIndex);
      }
    }

    console.log(this.editingVariants);
  }

  saveOption() {
    if(!this.confirmingDelete) {
      this.formError = "";
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i];
        if(option.name == "") {
          this.formError = "Please enter name for all options.";
          return
        }
  
        if(option.new) {
          if(option.values[0] == "") {
            this.formError = "Please enter a default value for new option.";
            return
          }
        }
      }
      if(this.deletedVariants.length) {
        this.confirmingDelete = true;
      } else {
        this.dialogRef.close({
          variants: this.editingVariants,
          options: this.options,
          deletedVariants: this.deletedVariants
        });
      }
    } else {
      this.dialogRef.close({
        variants: this.editingVariants,
        options: this.options,
        deletedVariants: this.deletedVariants
      });
    }
  }
}
