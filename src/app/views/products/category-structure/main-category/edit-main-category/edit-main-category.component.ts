import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-edit-main-category',
  templateUrl: './edit-main-category.component.html',
  styleUrls: ['./edit-main-category.component.scss']
})
export class EditMainCategoryComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;
  bannerFile: File;
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
  previewImageSrc: string = "";

  addMetaField() {
    console.log("pushing")
    this.metaFields.push({
      field: "",
      value: ""
    })
  }

  deleteMetaField(index) {
    console.log(index);
    let tempFields = Object.assign([], this.metaFields);
    tempFields.splice(index, 1);
    this.metaFields = tempFields;
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

  ngOnInit(): void {
  }

}
