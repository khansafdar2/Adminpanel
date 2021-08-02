import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';


@Component({
  selector: 'app-add-variant',
  templateUrl: './add-variant.component.html',
  styleUrls: ['./add-variant.component.scss']
})
export class AddVariantComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router
  ) {
    this.productID = this.route.snapshot.paramMap.get("productID");
    this.variantForm.patchValue({
      product: this.productID
    });
  }

  loading: boolean = false;
  URLS = URLS;
  productID: string;
  optionsError: string = "";
  variantAvailable: boolean = true;
  productData = {
    options: [],
    variants: []
  };
  variantForm = this.fb.group({
    barcode: [""],
    compare_at_price: [0],
    price: [0],
    inventory_quantity: [0],
    option1: [null],
    option2: [null],
    option3: [null],
    product: [null],
    sku: ["", [Validators.required]],
    title: [""],
    is_physical: [true],
    weight: [0.1, [Validators.required, Validators.min(0.1)]],
  });

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
      this.variantForm.patchValue({
        title
      });
    } else {
      this.optionsError = "A variant with these options already exist.";
      this.variantAvailable = false;
    }
  }

  onPhysicalProductChange(event) {
    if(event.checked) {
      (this.variantForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
      this.variantForm.get('weight').setValue(0.1);
    } else {
      (this.variantForm.controls['weight'] as FormControl).setValidators([]);
    }
  }

  onSubmit() {
    this.loading = true;
    this.productsService.createVariant(this.variantForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Variant created successfully.", "", {duration: 3000});
        this.router.navigate(['/', URLS.products, URLS.edit, this.productID]);
      }
    })
  }

  ngOnInit(): void {
    this.getProductDetail();
  }

}
