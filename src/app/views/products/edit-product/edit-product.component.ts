import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) { }

  loading: boolean = true;
  URLS = URLS;
  productTypes: any[] = [];
  productGroups: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  brands: any[] = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  productForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", []],
    features: this.fb.array([
      this.fb.group({
        feature_title: [''],
        feature_details: ['']
      })
    ]),
    product_images: [[]],
    product_type: [null],
    product_group: [null, [Validators.required]],
    product_brand: [null],
    collection: [[]],
    vendor: [null],
    is_active: [false],
    hide_out_of_stock: [false],
    apply_shipping: [false],
    apply_tax: [false]
  });

  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        feature_title: [''],
        feature_details: ['']
      })
    )
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
  }

  ngOnInit(): void {
  }

}
