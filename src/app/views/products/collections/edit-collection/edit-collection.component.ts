import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../vendors.service';
import { CollectionsService } from '../collections.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private vendorService: VendorsService,
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private snackbarService: MatSnackBar,
    private sharedService: SharedService,
    private productsService: ProductsService) {
    this.collectionID = this.route.snapshot.paramMap.get('id');
  }

  URLS = URLS;
  collectionID: string;
  loading: boolean = false;
  file_uploading: boolean = false;
  loadingProducts: boolean = true;
  productsPage: number = 1;
  bannerFile: File;
  vendors = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  collectionType: string = "Manual";
  previewImageSrc: string = "";
  main_categories = [];
  sub_categories = [];
  super_sub_categories = [];
  products = [];
  productCount: number = 0;
  // collectionConditions = {
  //   rule: "all",
  //   conditions: [
  //     {
  //       column: "tag",
  //       condition: "equal",
  //       value: ""
  //     }
  //   ]
  // }
  productColumns: Column[] = [
    {
      title: "Name",
      selector: "title"
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success': ''}">${row.is_active ? 'Active': 'Inactive'}</span>`
    },
    {
      title: "Inventory",
      selector: "inventory"
    },
    {
      title: "Vendor",
      selector: "vendor_name"
    },
    {
      title: "Type",
      selector: "product_type_name"
    }
  ]
  collectionForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    slug: [''],
    seo_title: [''],
    seo_description: [''],
    vendor: ['', [Validators.required]],
    banner_image: [null],
    is_active: [false],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
    meta_data: this.fb.array([])
  });


  addMetaField() {
    (this.collectionForm.get('meta_data') as FormArray).push(
      this.fb.group({
        field: [''],
        value: ['']
      })
    )
  }

  deleteMetaField(index) {
    (this.collectionForm.get('meta_data') as FormArray).removeAt(index);
  }

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.file_uploading = false;
      if(resp) {
        this.previewImageSrc = resp.data[0].cdn_link;
        this.collectionForm.patchValue({
          banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.collectionForm.patchValue({
      banner_image: null
    });
  }

  // addCondition() {
  //   this.collectionConditions.conditions.push({
  //     column: "tag",
  //     condition: "equal",
  //     value: ""
  //   });
  // }

  // deleteCondition(index) {
  //   let tempConditions = Object.assign([], this.collectionConditions.conditions);
  //   tempConditions.splice(index, 1);
  //   this.collectionConditions.conditions = tempConditions;
  // }

  getVendorsList() {
    this.vendorService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        this.vendors = resp.data.results;
      }
    })
  }

  getCategories() {
    this.collectionsService.getCategoriesList().then(resp => {
      if(resp) {
        this.main_categories = resp.data.main_categories;
        this.sub_categories = resp.data.sub_categories;
        this.super_sub_categories = resp.data.super_sub_categories;
      }
    });
  }

  getProducts() {
    this.loadingProducts = true;
    this.productsService.getProductsList(this.productsPage, 5, "&collection=" + this.collectionID, "").then(resp => {
      this.loadingProducts = false;
      if(resp) {
        console.log(resp.data);
        this.products = this.products.concat(resp.data.results);
        this.productCount = resp.data.count;
      }
    });
  }

  getCollectionDetail() {
    this.loading = true;
    this.collectionsService.getCollectionDetail(this.collectionID).then(resp =>{
      this.loading = false;
      if(resp) {
        let data = resp.data;
        let banner_image = data.banner_image;
        if(data.meta_data.length) {
          for (let i = 0; i < data.meta_data.length; i++) {
            this.addMetaField()
          }
        }
        if(data.banner_image) {
          data.banner_image = banner_image.id;
          this.previewImageSrc = banner_image.cdn_link;
        }
        this.collectionForm.patchValue(data);
      }
    })
  }

  onSubmit() {
    this.collectionForm.markAllAsTouched();
    if(!this.collectionForm.valid) {
      return false;
    }

    this.loading = true;
    this.collectionsService.updateCollectionDetail(this.collectionForm.value).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackbarService.open('Collection updated.', "", {duration: 3000});
      }
    })
  }

  loadMoreProducts() {
    this.productsPage += 1;
    this.getProducts();
  }

  ngOnInit(): void {
    this.getVendorsList();
    this.getCategories();
    this.getProducts();
    this.getCollectionDetail();
  }

}
