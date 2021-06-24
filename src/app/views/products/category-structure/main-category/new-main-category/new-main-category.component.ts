import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-new-main-category',
  templateUrl: './new-main-category.component.html',
  styleUrls: ['./new-main-category.component.scss']
})
export class NewMainCategoryComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  URLS = URLS;
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
  previewImageSrc: string = "";
  categoryForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    slug: [''],
    seo_title: [''],
    seo_description: [''],
    banner_image: [null],
    availability: [false],
    meta_data: this.fb.array([
      this.fb.group({
        field: [''],
        value: ['']
      })
    ])
  });
  // addMetaField() {
  //   console.log("pushing")
  //   this.metaFields.push({
  //     field: "",
  //     value: ""
  //   })
  // }

  // deleteMetaField(index) {
  //   console.log(index);
  //   let tempFields = Object.assign([], this.metaFields);
  //   tempFields.splice(index, 1);
  //   this.metaFields = tempFields;
  // }

  bannerImageSelect(e) {
    const reader = new FileReader();
    const file:File = e.target.files[0];
    this.bannerFile = file;
    reader.readAsDataURL(file);

    reader.onload = () => {
   
      this.previewImageSrc = reader.result as string; 
    }
  }

  ngOnInit(): void {
  }

}
