import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
    private snackbarService: MatSnackBar) {
    this.collectionID = this.route.snapshot.paramMap.get('id');
  }

  URLS = URLS;
  collectionID: string;
  loading: boolean = true;
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
    id: [0],
    title: ['', [Validators.required]],
    description: [''],
    slug: [''],
    seo_title: [''],
    seo_description: [''],
    vendor: ['', [Validators.required]],
    is_active: [false],
    meta_data: this.fb.array([])
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
    const reader = new FileReader();
    const file:File = e.target.files[0];
    this.bannerFile = file;
    reader.readAsDataURL(file);

    reader.onload = () => {
   
      this.previewImageSrc = reader.result as string; 
    }
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
