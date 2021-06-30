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
  hasVariants: boolean = false;
  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    },
    theme: "dragNDrop",
    multiple: false,
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
        field: [''],
        value: ['']
      })
    ]),
    product_images: [[]],
    product_type: [null],
    product_group: [null],
    product_brand: [null],
    collection: [[]],
    vendor: [null],
    is_active: [false],
    hide_out_of_stock: [false],
    apply_shipping: [false],
    apply_tax: [false]
  });

  addOption() {
    this.options.push({
      name: "",
      values: []
    });
  }

  deleteOption(index) {
    this.options.splice(index, 1);
  }

  makeVariantsFromOptions() {
    var valuesArrays = this.options.map(option => option.values);

    var combinations = this.sharedService.makeCombinationsFromLists(...valuesArrays);
    console.log(combinations);
    let variants = [];
    combinations.forEach(title => {
      let variant: Variant = {
        title,
        compare_at_price: 0,
        price: 0,
        inventory_quantity: 0,
        option1: title.split("/")[0],
        option2: title.split("/")[1],
        option3: title.split("/")[2],
        sku: ""
      }
      variants.push(variant);
    });

    this.variants = variants;
  }

  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        field: [''],
        value: ['']
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
    this.brandsService.getBrandsList().then(resp => {
      if(resp) {
        this.brands = resp.data;
      }
    });
  }

  ngOnInit(): void {
    this.getProductTypes();
    this.getProductGroups();
    this.getCollections();
    this.getVendors();
    this.getBrands();
  }

}
