import { CouponService } from './../coupon.service';
import { OrdersService } from './../../../orders/orders.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent implements OnInit {

  constructor(
    private snackbarService: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrdersService,
    private couponService: CouponService
  ) { }

  loading: boolean = false;
  URLS = URLS;
  custmerID:any;
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  couponForm = this.fb.group({
    name: [''],
    value: [null],
    customer: [null],
    expiry_date:['', [Validators.required]],
    note:['']
  })


  getCustomers() {
    this.customers = concat(
      of([]),
      this.customerInput.pipe(
        distinctUntilChanged(),
        tap(() => this.customersLoading = true),
        switchMap(term => this.orderService.getCustomersList(term).pipe(
          catchError(() => of([])),
          tap(() => this.customersLoading = false)
        ))
      )
    );
  }

  trackByFn(customer) {
    return customer.id;
  }

  onSubmit() {
    this.loading = true;
    this.couponService.createCoupon(this.couponForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Coupon created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.coupons]);
      }
    });
  }

  ngOnInit(): void {
    this.getCustomers();
  }

}
