import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-new-main-category',
  templateUrl: './new-main-category.component.html',
  styleUrls: ['./new-main-category.component.scss']
})
export class NewMainCategoryComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;
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
  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    },
    theme: "attachPin"
  };

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

  ngOnInit(): void {
  }

}
