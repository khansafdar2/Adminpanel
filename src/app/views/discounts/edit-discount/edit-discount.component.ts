import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from '../discounts.service';
import { environment } from 'src/environments/environment';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError, filter } from 'rxjs/operators';
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

  data = [];
  valueType: string = "handle";
  value = this.data;
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

  getCustomersForDetail(customer) {
    this.orderSerive.getCustomersList().subscribe(resp => {
      if (resp) {
        console.log(resp);
        let customerID = resp.map(this.mapCustomerID);
        let filtered_customer = customerID.filter(value =>{
          return value == customer
        }) 
        console.log(filtered_customer);
        this.customers = filtered_customer
      }
    })
  }

  trackByFn(customer) {
    return customer.id;
  }

  getProductGroups() {
    this.discountForm.patchValue({
      product_group: [[]]
    });
    let vendor = this.discountForm.get('vendor').value;
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if (resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getProductGroupsForDetail() {
    let vendor = this.discountForm.get('vendor').value;
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

  mapCustomerID(value){
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
    console.log(data);

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
    let mainObj = this.discountForm.value;
    mainObj.id = this.discountID
    this.discountsService.updateDiscount(mainObj).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Discount updated successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.discounts]);
      }
    });
  }


  getDiscountDetail() {
    this.loading = true;
    this.discountsService.getDiscountDetail(this.discountID).then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        
        this.products = resp.data.product
        this.yProducts = resp.data.y_product;
        let mainCategoryArray = []
        let mainCategoryObj = {
          id: null,
          type: ''
        }
        if (resp.data.main_category.length > 0) {
          for (let i = 0; i < resp.data.main_category.length; i++) {
            mainCategoryObj = { id: resp.data.main_category[i], type: "main" }
            mainCategoryArray.push(mainCategoryObj)
          }
        }
        let subCategoryObj;
        let subCategoryArray = []
        if (resp.data.sub_category.length > 0) {
          for (let i = 0; i < resp.data.sub_category.length; i++) {
            subCategoryObj = { id: resp.data.sub_category[i], type: "sub" }
            subCategoryArray.push(subCategoryObj)
          }
        }
        let superSubCategoryArray = []
        let superSubCategoryObj;
        if (resp.data.super_sub_category.length > 0) {
          for (let i = 0; i < resp.data.super_sub_category.length; i++) {
            superSubCategoryObj = { id: resp.data.super_sub_category[i], type: "superSub" }
            superSubCategoryArray.push(superSubCategoryObj)
          }
        }
        this.data = this.data.concat(mainCategoryArray);
        this.data = this.data.concat(subCategoryArray);
        this.data = this.data.concat(superSubCategoryArray);
        this.discountForm.patchValue(resp.data);
        let y_product = this.discountForm.get('y_product').value;
        if (y_product) {
          let y_productID = [];
          y_productID = this.yProducts.map(this.mapProductID);
          this.discountForm.patchValue({
            y_product: y_productID
          })
        }
        let product = this.discountForm.get('product').value;
        if (product) {
          let productID = [];
          productID = this.products.map(this.mapProductID);
          this.discountForm.patchValue({
            product: productID
          })
        }
        let vendor = this.discountForm.get('vendor').value;
        if (vendor) {
          this.getProductGroupsForDetail();
        }
        let customer = this.discountForm.get('customer_eligibility').value;
        if (customer == "customer_eligibility") {
          this.getCustomersForDetail(resp.data.customer);
        }
      }
    })
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getDiscountDetail();
    if (this.is_vendor) {
      this.getProductGroups();
    } else {
      this.getVendors();
    }
  }

}
