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
    private fb: FormBuilder,
    private discountsService: DiscountsService,
    private snackbarService: MatSnackBar,
    private vendorService: VendorsService,
    private productsService: ProductsService,
    private orderSerive: OrdersService,
    private router: Router,
    private authService: AuthService
  ) { }

  data: any = {
    title: "",
    category_handle: [
      {
        id: 6,
        name: "Deals of the month",
        handle: "deals-of-the-month",
        is_active: true
      },
      {
        id: 7,
        name: "Electronics & Computers",
        handle: "electronics",
        is_active: true
      }
    ]
  };

  valueType: string = "handle";
  // value = null;

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
  multiple = true;


  discountForm = this.fb.group({
    title: ["", [Validators.required]],
    discount_type: ["discount", [Validators.required]],
    value_type: ["percentage", [Validators.required]],
    value: [0, [Validators.required]],
    minimum_purchase_amount_check: ["none", [Validators.required]],
    customer_eligibility: ["everyone", [Validators.required]],
    criteria: [''],
    y_criteria: [''],
    customer: [[]],
    x_minimum_no_products: [0],
    y_minimum_no_products: [0],
    usage_limit: [0],
    vendor_id: [null],
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


  value = this.data.category_handle

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
    this.discountForm.patchValue({
      product_group: [[]]
    });
    let vendor;
    if (!this.is_vendor) {
      vendor = this.discountForm.get('vendor_id').value;
    } else {
      vendor = this.vendorID
    }
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if (resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  onVendorChange() {
    this.discountForm.patchValue({
      product_group: [[]]
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

  deleteSelectedProducts(index) {
    let productID = this.discountForm.get('product').value;
    productID.splice(index, 1);
    this.products.splice(index, 1);
  }

  deleteSelectedGetYFreeProducts(index) {
    let productID = this.discountForm.get('y_product').value;
    productID.splice(index, 1);
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

  onSubmit() {
    this.loading = true;
    this.discountForm.removeControl('minimum_purchase_amount_check');
    this.discountsService.createDiscount(this.discountForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Discount created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.discounts]);
      }
    });
  }


  ngOnInit(): void {
    this.getCustomers();

    if (this.is_vendor) {
      this.getProductGroups();
    } else {
      this.getVendors();
    }
  }
}
