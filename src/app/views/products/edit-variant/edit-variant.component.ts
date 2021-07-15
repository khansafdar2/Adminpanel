import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-edit-variant',
  templateUrl: './edit-variant.component.html',
  styleUrls: ['./edit-variant.component.scss']
})
export class EditVariantComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {
    this.productID = this.route.snapshot.paramMap.get("productID");
    this.variantID = this.route.snapshot.paramMap.get("id");
  }

  loading: boolean = false;
  URLS = URLS;
  productID: string;
  variantID: string;
  optionsError: string = "";
  variantAvailable: boolean = false;
  productData = {
    options: [],
    variants: []
  };
  variantForm = this.fb.group({
    id: [null],
    barcode: [""],
    compare_at_price: [0],
    price: [0],
    inventory_quantity: [0],
    option1: [null],
    option2: [null],
    option3: [null],
    product: [null],
    sku: [""],
    title: [""],
    weight: [0],
  });

  getVariantDetail() {
    this.productsService.getVariantDetail(this.variantID).then(resp => {
      if(resp) {
        console.log(resp.data);
        this.variantForm.patchValue(resp.data);
      }
    })
  }

  getProductDetail() {
    this.productsService.getProductDetail(this.productID).then(resp => {
      if(resp) {
        this.productData = resp.data;
      }
    });
  }

  checkVariantAvailability() {
    let available: boolean = true;
    let variantData = this.variantForm.value;
    let titleArray = [];
    let title = "";
    this.productData.options.forEach((option, index) => {
      titleArray.push(variantData['option' + (index + 1)]);
    });
    title = titleArray.join("/");
    this.productData.variants.forEach(variant => {
      if(variant.id !== variantData.id && variant.title === title) {
        available = false;
      }
    });

    if(available) {
      this.optionsError = "";
      this.variantAvailable = true;
    } else {
      this.optionsError = "A variant with these options already exist.";
      this.variantAvailable = false;
    }
  }

  ngOnInit(): void {
    this.getVariantDetail();
    this.getProductDetail();
  }

}
