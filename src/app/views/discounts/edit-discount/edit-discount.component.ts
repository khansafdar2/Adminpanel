import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';
import { environment } from 'src/environments/environment';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrdersService } from '../../orders/orders.service';
import { ProductsService } from '../../products/products.service';
import { VendorsService } from '../../vendors/vendors.service';

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
    private vendorService: VendorsService,
    private productsService: ProductsService,
    private orderSerive: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.discountID = this.route.snapshot.paramMap.get('id');
  }

  selected_categories = [];
  selected_y_categories = [];
  discountID: any;
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  productName: any[] = [];
  productTitle: any[] = [];
  loading: boolean = false;
  URLS = URLS;
  vendors: any;
  productGroups = [];
  products = [];
  yProducts = [];
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  storeCurrency = environment.currency;
  is_vendor = this.authService.user.is_vendor;
  vendorID = this.authService.user.vendor_id;

  discountForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required]],
    discount_type: ["discount", [Validators.required]],
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

  compareData(ob1, ob2)
  {
    return ob1.id === ob2.id
  }


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
    if (this.discountForm.get('vendor').value){
    this.getProductGroups();
    } else {
      this.discountForm.patchValue({
        product_group: [[]]
      });
      this.getProductGroups();
    }

  }


  onAddItems(items) {
    this.products = items;
    let productID = items.map(this.mapProductID);
    this.discountForm.patchValue({
      product: productID
    })
  }

  getYFreeAddItems(items) {
    this.yProducts = items;
    let productID = items.map(this.mapProductID);
    this.discountForm.patchValue({
      y_product: productID
    })
  }

  mapCustomerID(value) {
    return value.id;
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
    });
    this.subCategoryID = data.filter(this.filterSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      sub_category: this.subCategoryID
    });
    this.superSubCategoryID = data.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      super_sub_category: this.superSubCategoryID
    });
  }

  getYFreeCategorySelection(data) {
    this.mainCategoryID = data.filter(this.filterMainCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_main_category: this.mainCategoryID
    });
    this.subCategoryID = data.filter(this.filterSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_sub_category: this.subCategoryID
    });
    this.superSubCategoryID = data.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    this.discountForm.patchValue({
      y_super_sub_category: this.superSubCategoryID
    });
  }

  onDiscountTypeChange() {
    let discountType = this.discountForm.get('value_type').value;
    if (discountType === "percentage") {
      (this.discountForm.controls['value'] as FormControl).setValidators([Validators.required, Validators.max(100)]);
    } else {
      (this.discountForm.controls['value'] as FormControl).setValidators([Validators.required]);
    }
  }

  getDiscountDetail() {
    this.loading = true;
    this.discountsService.getDiscountDetail(this.discountID).then(resp => {
      this.loading = false;
      if (resp) {
        this.products = resp.data.product
        this.yProducts = resp.data.y_product;
        let mainCategoryArray = [];
        let subCategoryArray = [];
        let superSubCategoryArray = [];

        mainCategoryArray = resp.data.main_category.map(data => { return {category_id: data, category_type: "main"}})
        subCategoryArray = resp.data.sub_category.map(data => { return {category_id: data, category_type: "sub"}})
        superSubCategoryArray = resp.data.super_sub_category.map(data => { return {category_id: data, category_type: "superSub"}})
      
        // y categories
        let y_mainCategoryArray = [];
        let y_subCategoryArray = [];
        let y_superSubCategoryArray = [];
        y_mainCategoryArray = resp.data.y_main_category.map(data => { return {category_id: data, category_type:"main"}})
        y_subCategoryArray = resp.data.y_sub_category.map(data => { return {category_id: data, category_type:"sub"}})
        y_superSubCategoryArray = resp.data.y_super_sub_category.map(data => { return {category_id: data, category_type:"superSub"}})

        this.selected_categories = this.selected_categories.concat(mainCategoryArray);
        this.selected_categories = this.selected_categories.concat(subCategoryArray);
        this.selected_categories = this.selected_categories.concat(superSubCategoryArray);

        // y categories
        this.selected_y_categories = this.selected_y_categories.concat(y_mainCategoryArray);
        this.selected_y_categories = this.selected_y_categories.concat(y_subCategoryArray);
        this.selected_y_categories = this.selected_y_categories.concat(y_superSubCategoryArray);
        if (resp.data.y_product) {
          resp.data.y_product = resp.data.y_product.map(this.mapProductID);
        }
        if (resp.data.product) {
          resp.data.product = resp.data.product.map(this.mapProductID);
        }
        this.discountForm.patchValue(resp.data);
        if (this.is_vendor) {
          this.getProductGroups();
        } else {
          this.onVendorChange();
          this.getVendors();
        }
      }
    });
  }
  
  onCriteriaChange(){
    if (!this.is_vendor) {
      if (this.discountForm.get('criteria').value != "product_group"){
        this.discountForm.get("vendor").setValue(null)
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.discountsService.updateDiscount(this.discountForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Discount updated successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.discounts]);
      }
    });
  }


  ngOnInit(): void {
    this.getCustomers();
    this.getDiscountDetail();
   
  }
}
