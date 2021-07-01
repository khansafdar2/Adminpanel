import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';

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
    private sharedService: SharedService) { }

  loading: boolean = false;
  URLS = URLS;
  productTypes: any[] = [];
  productGroups: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  brands: any[] = [];
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
  hasVariants: boolean = false;
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
    product_group: [null, [Validators.required]],
    product_brand: [null],
    collection: [[]],
    vendor: [null],
    is_active: [false],
    hide_out_of_stock: [false],
    apply_shipping: [false],
    apply_tax: [false]
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
    combinations.forEach(title => {
      // let variant: Variant = {
      //   title,
      //   price: this.priceForm.get('price').value,
      //   compare_at_price: this.priceForm.get('compare_at_price').value,
      //   inventory_quantity: this.inventoryForm.get('inventory_quantity').value,
      //   option1: title.split("/")[0] || null,
      //   option2: title.split("/")[1] || null,
      //   option3: title.split("/")[2] || null,
      //   sku: this.inventoryForm.get('sku').value,
      //   barcode: this.inventoryForm.get('barcode').value
      // }

      let variant = this.fb.group({
        title: [title],
        price: [this.priceForm.get('price').value],
        compare_at_price: [this.priceForm.get('compare_at_price').value],
        inventory_quantity: [this.inventoryForm.get('inventory_quantity').value],
        option1: [title.split("/")[0] || null],
        option2: [title.split("/")[1] || null],
        option3: [title.split("/")[2] || null],
        sku: [this.inventoryForm.get('sku').value],
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
    )
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
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

  removeVariant(index) {
    (this.variantsForm.get('variants') as FormArray).removeAt(index);
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

  onSubmit() {

  }

  ngOnInit(): void {
    this.getProductTypes();
    this.getProductGroups();
    this.getCollections();
    this.getVendors();
    this.getBrands();
  }

}
