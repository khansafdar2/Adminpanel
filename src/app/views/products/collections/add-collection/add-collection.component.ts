import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../../vendors.service';
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
    private snackbarService: MatSnackBar,
    private router: Router,
    private sharedService: SharedService) { }

  URLS = URLS;
  loading: boolean = false;
  file_uploading: boolean = false;
  bannerFile: File;
  vendors = [];
  metaFields = [
    {
      field: "",
      value: ""
    }
  ];
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
    is_active: [false],
    meta_data: this.fb.array([
      this.fb.group({
        field: [''],
        value: ['']
      })
    ])
  })


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
    // const reader = new FileReader();
    // const file:File = e.target.files[0];
    // this.bannerFile = file;
    // reader.readAsDataURL(file);

    // reader.onload = () => {
    //   this.previewImageSrc = reader.result as string; 
    // }

    const file = e.target.files[0];
    this.file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.file_uploading = false;
      if(resp) {
        console.log(resp.data);
        this.previewImageSrc = resp.data.cdn_link;
      }
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

  onSubmit() {
    this.collectionForm.markAllAsTouched();
    if(!this.collectionForm.valid) {
      return false;
    }

    console.log(this.collectionForm.value)
    this.collectionsService.createCollection(this.collectionForm.value).then(resp => {
      if(resp) {
        this.snackbarService.open('Collection created.', "", {duration: 3000});
        this.router.navigate(['', URLS.collections]);
      }
    })
  }

  ngOnInit(): void {
    this.getVendorsList();
  }

}
