import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import URLS from 'src/app/shared/urls';
import { MatChipInputEvent } from '@angular/material/chips';

interface Option {
  name: string;
  options: string[]
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor() { }

  loading: boolean = false;
  URLS = URLS;
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  features = [
    {
      title: "",
      detail: ""
    }
  ]
  separatorKeysCodes: number[] = [ENTER, COMMA];
  variants: Option[] = [
    {
      name: "",
      options: []
    }
  ]
  variantOptionsInputCtrl = [
    new FormControl()
  ]
  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    },
    theme: "dragNDrop",
    multiple: false,
    formatsAllowed: '.jpg,.jpeg,.png',
    hideResetBtn: true,
    replaceTexts: {
      selectFileBtn: "Select images",
      dragNDropBox: "Drop images here.",
      uploadBtn: "Upload and save"
    }
  };

  addOptionValue(event: MatChipInputEvent, index): void {
    const value = (event.value || '').trim();

    if (value) {
      this.variants[index].options.push(value);
    }

    this.variantOptionsInputCtrl[index].setValue(null);
  }

  removeOptionValue(tag: string, index): void {
    const i = this.variants[index].options.indexOf(tag);

    if (i >= 0) {
      this.variants[index].options.splice(i, 1);
    }
  }

  addOption() {
    this.variantOptionsInputCtrl.push(new FormControl());

    this.variants.push({
      name: "",
      options: []
    });
  }

  deleteOption(index) {
    this.variants.splice(index, 1);
    this.variantOptionsInputCtrl.splice(index, 1);
  }

  deleteFeature(index) {
    let tempFeatures = Object.assign([], this.features);
    tempFeatures.splice(index, 1);
    this.features = tempFeatures;
  }

  addFeature() {
    this.features.push({
      title: "",
      detail: ""
    });
  }

  ngOnInit(): void {
  }

}
