import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute } from '@angular/router';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  constructor(
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
    apply_tax: [false]
  });
  bannerImages = [];

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
      }
    });
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
