import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router
  ) {
    this.productID = this.route.snapshot.paramMap.get("productID");
    this.variantID = this.route.snapshot.paramMap.get("id");
  }

  loading: boolean = false;
  URLS = URLS;
  productID: string;
  variantID: string;
  optionsError: string = "";
  changingPrice: boolean = false;
  originalPrice: string = "";
  variantAvailable: boolean = true;
  productData = {
    options: [],
    variants: [],
    is_discount: false
  };
  variantForm = this.fb.group({
    id: [null],
    barcode: [""],
    compare_at_price: [0],
    price: [0],
    cost_per_item: [0],
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

  getVariantDetail() {
    this.productsService.getVariantDetail(this.variantID).then(resp => {
      if(resp) {
        console.log(resp.data);
        this.originalPrice = resp.data.price;
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

  onPriceChange() {
    if(this.productData.is_discount) {
      let newPrice = this.variantForm.get('price').value;
      if(newPrice != this.originalPrice) {
        this.changingPrice = true;
      } else {
        this.changingPrice = false;
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.productsService.updateVariant(this.variantForm.value).then(resp => {
      this.loading = false;
      if(resp.isAxiosError) {
        if(resp.response.status === 422) {
          alert("A variant with this SKU already exists.");
        }
      } else {
        if(resp) {
          this.snackbarService.open("Variant updated successfully.", "", {duration: 3000});
          this.router.navigate(['/', URLS.products, URLS.edit, this.productID]);
        }
      }
    })
  }

  ngOnInit(): void {
    this.getVariantDetail();
    this.getProductDetail();
  }

}
