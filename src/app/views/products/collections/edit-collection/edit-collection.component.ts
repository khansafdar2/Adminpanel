import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
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
    private sharedService: SharedService) {
    this.collectionID = this.route.snapshot.paramMap.get('id');
  }

  URLS = URLS;
  collectionID: string;
  loading: boolean = false;
  file_uploading: boolean = false;
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
  collectionConditions = {
    rule: "all",
    conditions: [
      {
        column: "tag",
        condition: "equal",
        value: ""
      }
    ]
  }
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
        console.log(resp.data);
        this.previewImageSrc = resp.data[0].cdn_link;
        console.log(this.previewImageSrc);
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

  addCondition() {
    this.collectionConditions.conditions.push({
      column: "tag",
      condition: "equal",
      value: ""
    });
  }

  deleteCondition(index) {
    let tempConditions = Object.assign([], this.collectionConditions.conditions);
    tempConditions.splice(index, 1);
    this.collectionConditions.conditions = tempConditions;
  }

  getVendorsList() {
    this.vendorService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        this.vendors = resp.data.results;
      }
    })
  }

  getCollectionDetail() {
    this.loading = true;
    this.collectionsService.getCollectionDetail(this.collectionID).then(resp =>{
      this.loading = false;
      if(resp) {
        if(resp.data.meta_data.length) {
          for (let i = 0; i < resp.data.meta_data.length; i++) {
            this.addMetaField()
          }
        }
        this.collectionForm.patchValue(resp.data);
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

  ngOnInit(): void {
    this.getVendorsList();
    this.getCollectionDetail();
  }

}
