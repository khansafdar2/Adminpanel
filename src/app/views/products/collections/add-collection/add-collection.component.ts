import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
