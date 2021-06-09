import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

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
