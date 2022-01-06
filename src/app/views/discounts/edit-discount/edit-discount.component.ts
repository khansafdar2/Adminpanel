
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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
    private route:ActivatedRoute
  ) {
    this.discountID = this.route.snapshot.paramMap.get('id');
   }
  
  @Input() data:any = {
    title: "",
    category_handle: ''
  };
  loading: boolean = false;
  URLS = URLS;
  vendors:any;
  productGroups:any;
  discountID:any;
  lineitems = [];
  selected:any;
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  storeCurrency = environment.currency;
  discountForm = this.fb.group({
    title: ["", [Validators.required]],
    discount_type: ["discount", [Validators.required]],
    value_type: ["percentage", [Validators.required]],
    type_value: [0, [Validators.required]],
    minimum_amount: ["none", [Validators.required]],
    customer_eligibility: ["everyone", [Validators.required]],
    selectedCustomer:[''],
    usage: [""],
    vendor_id: [null],
    product: [[]],
    categories: [[]],
    product_group:[[]],
    is_active: [false],
    start_date: [''],
    end_date: [''],
    show_both_price: [false],
    show_tag: [false]
  });


  getVendors() {
    this.vendorService.getVendorsList(1, 150).then(resp => {
      if(resp) {
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

  getProductGroups() {
    this.discountForm.patchValue({
      product_group: ""
    });
    let vendor = this.discountForm.get('vendor_id').value;
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if(resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  onVendorChange() {
    this.discountForm.patchValue({
      product_group: "",
    });
    this.getProductGroups();
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
    let discountType = this.discountForm.get('value_type').value;
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
    this.getCustomers()
    this.getDiscountDetail();
    this.getVendors();

  }
  
}
