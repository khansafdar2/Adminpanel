import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../../vendors/vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Option {
  name: string;
  values: string[]
}

interface Variant {
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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private collectionsService: CollectionsService,
    private vendorsService: VendorsService,
    private brandsService: BrandsService,
    private sharedService: SharedService,
    private snackbarService: MatSnackBar,
    private router: Router) { }

  loading: boolean = false;
  URLS = URLS;
  productTypes: any[] = [];
  productGroups: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  brands: any[] = [];
  productTags:string[] = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  options: Option[] = [
    {
      name: "",
      values: []
    }
  ]
  variants: Variant[] = [];
  bannerImages = [];
  afuConfig = {
    uploadAPI: this.sharedService.afuUploadAPI,
    theme: "dragNDrop",
    multiple: true,
    formatsAllowed: '.jpg,.jpeg,.png',
    hideResetBtn: true,
    replaceTexts: {
      selectFileBtn: "Select images",
      dragNDropBox: "Drop images here.",
      uploadBtn: "Upload and save",
      sizeLimit: "Recommended resolution: 1600x1600, Size Limit"
    }
  };
  productForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", []],
    features: this.fb.array([
      this.fb.group({
        feature_title: [''],
        feature_details: ['']
      })
    ]),
    product_images: [[]],
    product_type: [null],
    product_group: [""],
    product_brand: [null],
    collection: [[]],
    vendor: [null, [Validators.required]],
    is_active: [{value: false, disabled: true}],
    whatsapp: [true],
    hide_out_of_stock: [false],
    warranty: [""],
    tags: [""],
    has_variants: [false]
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
    compare_at_price: [0],
    cost_per_item: [0]
  });

  variantsForm = this.fb.group({
    variants: this.fb.array([])
  });

  addOption() {
    this.options.push({
      name: "",
      values: []
    });
  }

  deleteOption(index) {
    this.options.splice(index, 1);
    this.makeVariantsFromOptions();
  }

  makeVariantsFromOptions() {
    var valuesArrays = this.options.map(option => option.values);

    var combinations = this.sharedService.makeCombinationsFromLists(...valuesArrays);
    (this.variantsForm.get('variants') as FormArray).clear();
    combinations.forEach((title, i) => {

      let variant = this.fb.group({
        title: [title],
        price: [this.priceForm.get('price').value],
        compare_at_price: [this.priceForm.get('compare_at_price').value],
        cost_per_item: [this.priceForm.get('cost_per_item').value],
        inventory_quantity: [this.inventoryForm.get('inventory_quantity').value],
        is_physical: [this.inventoryForm.get('is_physical').value],
        weight: [this.inventoryForm.get('weight').value],
        option1: [title.split("/")[0] || null],
        option2: [title.split("/")[1] || null],
        option3: [title.split("/")[2] || null],
        sku: [this.inventoryForm.get('sku').value + "-" + (i+1), [Validators.required]],
        barcode: [this.inventoryForm.get('barcode').value]
      });

      (this.variantsForm.get('variants') as FormArray).push(variant);
    });
  }

  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        feature_title: [''],
        feature_details: ['']
      })
    );
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
  }

  getProductGroups() {
    this.productForm.patchValue({
      product_group: ""
    });
    let vendor = this.productForm.get('vendor').value;
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if(resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getCollections() {
    let vendor = this.productForm.get('vendor').value;
    this.collectionsService.getCollectionsList(1, 250, "&vendor=" + vendor, "").then(resp => {
      if(resp) {
        this.collections = resp.data.results;
      }
    })
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 150).then(resp => {
      if(resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getBrands() {
    this.brandsService.getBrandsList(1, 250, "").then(resp => {
      if(resp) {
        this.brands = resp.data.results;
      }
    });
  }

  removeVariant(index) {
    (this.variantsForm.get('variants') as FormArray).removeAt(index);
  }

  mediaUpload(response) {
    if(response.status === 200) {
      this.bannerImages = this.bannerImages.concat(response.body);
      let imageIDs = response.body.map(image => image.id);
      let product_images = this.productForm.get('product_images').value;
      this.productForm.patchValue({
        product_images: product_images.concat(imageIDs)
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

  onHasVariantChange(event) {
    if(event.checked) {
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
  }

  onPhysicalProductChange(event) {
    if(event.checked) {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
      this.inventoryForm.patchValue({
        weight: 0.1
      });
    } else {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([]);
      this.inventoryForm.patchValue({
        weight: 0
      });
    }
  }

  onWeightChange() {
    let weight = this.inventoryForm.get('weight').value;
    let variants = this.variantsForm.value.variants;
    for (let i = 0; i < variants.length; i++) {
      variants[i].weight = weight;
    }
    this.variantsForm.patchValue({
      variants
    });
  }

  onSubmit() {
    let productData = this.productForm.value;
    let inventoryData = this.inventoryForm.value;
    let priceData = this.priceForm.value;
    let variantsData = this.variantsForm.value;
    let variants = [];
    let productOptions = [];

    if(!productData.has_variants) {
      let defaultVariant = {
        title: "Default Title",
        price: priceData.price,
        compare_at_price: priceData.compare_at_price,
        cost_per_item: priceData.cost_per_item,
        inventory_quantity: inventoryData.inventory_quantity,
        is_physical: inventoryData.is_physical,
        option1: "Default Title",
        option2: null,
        option3: null,
        weight: inventoryData.weight,
        sku: inventoryData.sku,
        barcode: inventoryData.barcode
      }

      variants.push(defaultVariant);
    } else {
      variants = this.variantsForm.value.variants;
      productOptions = this.options.map(option => {
        return {
          name: option.name,
          values: option.values.join(","),
          position: 1
        }
      })
    }

    productData.options = productOptions;
    productData.variants = variants;
    productData.tags = this.productTags.length ? this.productTags.join(",") : "";
    productData.track_inventory = inventoryData.track_inventory,
    this.loading = true;
    this.productsService.createProduct(productData).then(resp => {
      this.loading = false;
      if(resp.isAxiosError) {
        if(resp.response.status === 404) {
          alert("A variant with this SKU already exists.");
        }
      } else {
        if(resp.data) {
          this.snackbarService.open("Product created.", "", {duration: 3000});
          this.router.navigate(["/", URLS.products]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getVendors();
    this.getBrands();
  }

}
