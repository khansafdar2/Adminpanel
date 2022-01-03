import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private discountsService: DiscountsService,
    private snackbarService: MatSnackBar,
    private router: Router
  ) { }
  
  @Input() data:any = {
    title: "",
    category_handle: ''
  };
  loading: boolean = false;
  URLS = URLS;
  lineitems = [];
  selected:any
  storeCurrency = environment.currency;
  discountForm = this.fb.group({
    title: ["", [Validators.required]],
    discount_type: ["", [Validators.required]],
    type_value: [0, [Validators.required]],
    usage: [""],
    is_active: [false],
    show_both_price: [false],
    show_tag: [false]
  });

  onCriteriaSelection(event) {
    if (event.value == 'product') {
      this.selected = event.value;
      this.discountForm.patchValue({
        products: this.fb.array([])
      });
      this.onAddItems;
    } else if (event.value == 'category') {
      this.selected = event.value;
      this.discountForm.patchValue({
        categories: this.fb.array([])
      })
    } else {
      this.selected = event.value;
      this.discountForm.patchValue({
        product_group: this.fb.array([])
      })
    }
  }


  onAddItems(items) {
    this.lineitems = this.lineitems.concat(items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      (this.discountForm.get('product') as FormArray).push(
        this.fb.group({
          id: item.variant.id,
          vendor_name: item.vendor_name,
          vendor: item.vendor_id,
          product_name: item.title,
          variant_title: item.variant.title,
          image: item.image,
          shipping: item.shipping,
          inventory_quantity: item.variant.inventory_quantity,
          qty: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
          price: item.variant.price,
          sku: item.variant.sku,
        })
      );
    }
  }

  onDiscountTypeChange() {
    let discountType = this.discountForm.get('discount_type').value;
    if (discountType === "percentage") {
      (this.discountForm.controls['type_value'] as FormControl).setValidators([Validators.required, Validators.max(100)]);
    } else {
      (this.discountForm.controls['type_value'] as FormControl).setValidators([Validators.required]);
    }
  }

  onSubmit() {
    this.loading = true;
    this.discountsService.createDiscount(this.discountForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Discount created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.discounts]);
      }
    });
  }

  ngOnInit(): void {
  }

}
