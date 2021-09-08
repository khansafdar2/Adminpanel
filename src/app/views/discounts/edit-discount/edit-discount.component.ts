import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.scss']
})
export class EditDiscountComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private discountsService: DiscountsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.discountID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  discountID: string = null;
  discountForm = this.fb.group({
    id: [null],
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

  getDiscountDetail() {
    this.loading = true;
    this.discountsService.getDiscountDetail(this.discountID).then(resp => {
      this.loading = false;
      if(resp) {
        this.discountForm.patchValue(resp.data);
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.discountsService.updateDiscount(this.discountForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Discount updated successfully.", "", {duration: 3000});
      }
    });
  }

  ngOnInit(): void {
    this.getDiscountDetail();
  }

}
