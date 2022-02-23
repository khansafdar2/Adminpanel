import { OrdersService } from './../../orders/orders.service';
import { ProductsService } from './../../products/products.service';
import { VendorsService } from './../../vendors/vendors.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit {

  constructor(
    private discountsService: DiscountsService,
    private vendorService: VendorsService,
    private productsService: ProductsService,
    private orderSerive: OrdersService,
    private snackbarService: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  productName: any[] = [];
  productTitle: any[] = [];
  loading: boolean = false;
  URLS = URLS;
  vendors: any;
  productGroups: any;
  products = [];
  yProducts = [];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  storeCurrency = environment.currency;
  is_vendor = this.authService.user.is_vendor;
  vendorID = this.authService.user.vendor_id;

  discountForm = this.fb.group({
    title: ["", [Validators.required]],
    discount_type: ["simple_discount", [Validators.required]],
    value_type: ["percentage", [Validators.required]],
    value: [0, [Validators.required]],
    check_minimum_purchase_amount: ["none"],
    customer_eligibility: ["everyone"],
    criteria: [''],
    y_criteria: [''],
    promo_code: [''],
    customer: [[]],
    x_minimum_no_products: [0],
    y_minimum_no_products: [0],
    usage_limit: [0],
    vendor: [null],
    product: [[]],
    product_group: [[]],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
    y_product: [[]],
    y_product_group: [[]],
    y_main_category: [[]],
    y_sub_category: [[]],
    y_super_sub_category: [[]],
    is_active: [false],
    start_date: [''],
    end_date: [''],
    show_both_price: [false],
    show_tag: [false],
    minimum_purchase_amount: [null]
  });


  getVendors() {
    this.vendorService.getVendorsList(1, 150).then(resp => {
      if (resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getCustomers() {
    this.customers = concat(
      of([]),
      this.customerInput.pipe(
        distinctUntilChanged(),
        tap(() => this.customersLoading = true),
        switchMap(term => this.orderSerive.getCustomersList(term).pipe(
          catchError(() => of([])),
          tap(() => this.customersLoading = false)
        ))
      )
    );
  }

  trackByFn(customer) {
    return customer.id;
  }

  getProductGroups() {
    let vendor;
    if (this.is_vendor) {
      vendor = this.vendorID
    } else {
      vendor = this.discountForm.get('vendor').value;
    }
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if (resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  onVendorChange() {
    this.discountForm.patchValue({
      product_group: []
    });
    this.getProductGroups();
  }


  onAddItems(items) {
    this.products = items;
    let productID = [];
    productID = items.map(this.mapProductID);
    this.discountForm.patchValue({
      product: productID
    })
  }

  getYFreeAddItems(items) {
    this.yProducts = items;
    let productID = [];
    productID = items.map(this.mapProductID);
    this.discountForm.patchValue({
      y_product: productID
    })
  }

  mapProductID(value) {
    return value.id;
  }

  mapCategoryID(value) {
    return value.category_id;
  }

  filterMainCategory(value) {
    return value.category_type == "main";
  }

  filterSubCategory(value) {
    return value.category_type == "sub";
  }

  filterSuperSubCategory(value) {
    return value.category_type == "superSub";
  }

  deleteSelectedProduct(index) {
    let productID = this.discountForm.get('product').value;
    productID.splice(index, 1);
    this.discountForm.patchValue({
      product: productID
    })
    this.products.splice(index, 1);
  }

  deleteSelectedGetYFreeProduct(index) {
    let productID = this.discountForm.get('y_product').value;
    productID.splice(index, 1);
    this.discountForm.patchValue({
      product: productID
    })
    this.yProducts.splice(index, 1);
  }

  onCategorySelection(data) {
    this.mainCategoryID = data.filter(this.filterMainCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      main_category: this.mainCategoryID
    })
    this.subCategoryID = data.filter(this.filterSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      sub_category: this.subCategoryID
    })
    this.superSubCategoryID = data.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      super_sub_category: this.superSubCategoryID
    })
  }

  getYFreeCategorySelection(data) {
    this.mainCategoryID = data.filter(this.filterMainCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_main_category: this.mainCategoryID
    })
    this.subCategoryID = data.filter(this.filterSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_sub_category: this.subCategoryID
    })
    this.superSubCategoryID = data.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_super_sub_category: this.superSubCategoryID
    })
  }

  onDiscountTypeChange() {
    let discountType = this.discountForm.get('value_type').value;
    if (discountType === "percentage") {
      (this.discountForm.controls['value'] as FormControl).setValidators([Validators.required, Validators.max(100)]);
    } else {
      (this.discountForm.controls['value'] as FormControl).setValidators([Validators.required]);
    }
  }

  onCriteriaChange() {
    if (!this.is_vendor) {
      if (this.discountForm.get('criteria').value != "product_group") {
        this.discountForm.get("vendor").setValue(null)
      }
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



  discountTypeChange() {
    let discountType = this.discountForm.get('discount_type').value
    if (discountType !== 'simple_discount') {
      (this.discountForm.controls['start_date'] as FormControl).setValidators([Validators.required]);
      (this.discountForm.controls['end_date'] as FormControl).setValidators([Validators.required]);
    } else {
      (this.discountForm.controls['start_date'] as FormControl).clearValidators();
      (this.discountForm.controls['end_date'] as FormControl).clearValidators();
    }
    (this.discountForm.controls['start_date'] as FormControl).updateValueAndValidity();
    (this.discountForm.controls['end_date'] as FormControl).updateValueAndValidity();
  }

  ngOnInit(): void {
    this.getCustomers();
    if (this.is_vendor) {
      this.discountForm.patchValue({
        vendor: this.vendorID
      })
      this.getProductGroups();
    } else {
      this.getVendors();
    }
  }
}
