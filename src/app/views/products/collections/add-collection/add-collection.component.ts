import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../../../vendors/vendors.service';
import { CollectionsService } from '../collections.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private vendorService: VendorsService,
    private collectionsService: CollectionsService,
    private authservice:AuthService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private sharedService: SharedService) { }

  URLS = URLS;
  loading: boolean = false;
  file_uploading: boolean = false;
  is_vendor = this.authservice.user.is_vendor;
  vendorID = this.authservice.user.vendor_id;
  bannerFile: File;
  vendors = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  previewImageSrc: string = "";
  main_categories = [];
  sub_categories = [];
  commissionList = [];
  super_sub_categories = [];
  // collectionType: string = "Manual";
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
  collectionForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    vendor: ['', [Validators.required]],
    banner_image: [null],
    is_active: [false],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
    meta_data: this.fb.array([
      this.fb.group({
        field: [''],
        value: ['']
      })
    ])
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

  onSubmit() {
    this.collectionForm.markAllAsTouched();
    if(!this.collectionForm.valid) {
      return false;
    }

    this.loading = true;
    this.collectionsService.createCollection(this.collectionForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('Collection created.', "", {duration: 3000});
        this.router.navigate(['/', URLS.collections]);
      }
    })
  }

  ngOnInit(): void {
    if (this.is_vendor) {
      this.collectionForm.patchValue({
        vendor:this.vendorID
      })
    } else {
      this.getVendorsList();
    }
    this.getCategories();
  }

}
