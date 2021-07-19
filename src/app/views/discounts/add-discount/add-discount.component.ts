import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';

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

  loading: boolean = false;
  URLS = URLS;
  discountForm = this.fb.group({
    title: ["", [Validators.required]],
    discount_type: ["", [Validators.required]],
    type_value: [0, [Validators.required]],
    usage: [""],
    is_active: [false],
    show_both_price: [false],
    show_tag: [false]
  });

  onDiscountTypeChange() {
    let discountType = this.discountForm.get('discount_type').value;
    if(discountType === "percentage") {
      (this.discountForm.controls['type_value'] as FormControl).setValidators([Validators.required, Validators.max(100)]);
    } else {
      (this.discountForm.controls['type_value'] as FormControl).setValidators([Validators.required]);
    }
  }

  onSubmit() {
    this.loading = true;
    this.discountsService.createDiscount(this.discountForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Discount created successfully.", "", {duration: 3000});
        this.router.navigate(['/', URLS.discounts]);
      }
    });
  }

  ngOnInit(): void {
  }

}
