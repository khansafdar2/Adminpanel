import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ShippingService } from 'src/app/views/configuration/shipping/shipping.service';
import { DiscountsService } from 'src/app/views/discounts/discounts.service';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../../vendors/vendors.service';

@Component({
  selector: 'app-add-product-group',
  templateUrl: './add-product-group.component.html',
  styleUrls: ['./add-product-group.component.scss']
})
export class AddProductGroupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private productsService: ProductsService,
    private shippingService: ShippingService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private discountsService: DiscountsService) { }

  loading: boolean = true;
  URLS = URLS;
  vendors: [];
  discounts: [];
  shippingMethods = [];
  productGroupForm = this.fb.group({
    title: ['', [Validators.required]],
    vendor: [null, [Validators.required]],
    discount: [""],
    shipping: [""],
    tat: [""]
  });

  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      this.loading = false;
      if(resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getDiscounts() {
    this.discountsService.getDiscountsList().then(resp => {
      if(resp) {
        this.discounts = resp.data.results;
      }
    })
  }

  getShippingMethods() {
    this.shippingService.getShippingMethods(1, 50).then(resp => {
      if(resp) {
        this.shippingMethods = resp.data.results;
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.productsService.createProductGroup(this.productGroupForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Product group created.", "", {duration: 3000});
        this.router.navigate(["/", URLS.productGroups]);
      }
    })
  }

  ngOnInit(): void {
    this.getVendors();
    this.getDiscounts();
    this.getShippingMethods();
  }

}
