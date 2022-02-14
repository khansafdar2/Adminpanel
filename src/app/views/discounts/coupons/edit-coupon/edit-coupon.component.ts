import { CouponService } from '../coupons.service';
import { OrdersService } from './../../../orders/orders.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { concat, Observable, of, Subject} from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})
export class EditCouponComponent implements OnInit {


  constructor(
    private snackbarService: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrdersService,
    private couponService: CouponService,
    private route: ActivatedRoute,

  ) {
    this.couponID =this.route.snapshot.paramMap.get('id');
   }

  loading: boolean = false;
  URLS = URLS;
  couponID:any;
  customers: Observable<any[]>;
  customerInput = new Subject<string>();
  customersLoading: boolean = false;
  couponForm = this.fb.group({
    id:[null],
    unique_id: [{value:"", disabled:true}],
    value: [null],
    name: [""],
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

  compareData(ob1, ob2)
  {
    return ob1.id === ob2.id
  }


  getCouponDetaial(){
    this.couponService.getCouponDetail(this.couponID).then(resp => {
      this.loading = false;
      if (resp){
        this.couponForm.patchValue(resp.data);

      }
    })
  }


  onSubmit() {
    this.loading = true;
    let mainObj = this.couponForm.value;
    mainObj.customer = mainObj.customer.id;
    this.couponService.updateCoupon(mainObj).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Coupon updated successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.coupons]);
      }
    });
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getCouponDetaial();
  }

}
