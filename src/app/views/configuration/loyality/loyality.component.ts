import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-loyality',
  templateUrl: './loyality.component.html',
  styleUrls: ['./loyality.component.scss']
})
export class LoyalityComponent implements OnInit {

  constructor( private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbarService: MatSnackBar,) { }

  URLS = URLS;
  storeCurrency = environment.currency;


  loyalityForm = this.fb.group({
    amount_equal_point: [null],
    point_equal_amount: [null],
    start_loyalty_amount: [null],
    minimum_orders_loyalty_start: [null],
    minimum_point_redeem: [null],
    platform: [''],
    order_url: [''],
    spending_amount: [null],
    no_of_point: [null],
    no_of_order: [null],
    order_base: [false],
    amount_base: [false],
    is_active: [false],
    setting: [null]
  })

  ngOnInit(): void {
  }

}
