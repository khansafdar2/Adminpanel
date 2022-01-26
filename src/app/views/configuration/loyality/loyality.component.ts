import { LoyalityService } from './loyality.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-loyality',
  templateUrl: './loyality.component.html',
  styleUrls: ['./loyality.component.scss']
})
export class LoyalityComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbarService: MatSnackBar,
    private loyalityService: LoyalityService
  ) { }

  URLS = URLS;
  loading = false;
  storeCurrency = environment.currency;
  loyalitydetails: any;


  loyalityForm = this.fb.group({
    amount_equal_point: [null],
    point_equal_amount: [null],
    start_loyalty_amount: [null],
    minimum_orders_loyalty_start: [null],
    minimum_point_redeem: [null],
    rule: this.fb.array([])
  })


  addRule() {
    (this.loyalityForm.get("rule") as FormArray).push(
      this.fb.group({
        spending_amount: [null],
        no_of_point: [null],
        no_of_order: [null],
        start_date: [''],
        end_date: [''],
        type: ['amount'],
        paid_order: [true],
        is_active: [true]
      })
    )
  }

  removeRule(index) {
    (this.loyalityForm.get('rule') as FormArray).removeAt(index);
  }

  onSubmit() {
    this.loading = true;
    this.loyalityService.createLoyality(this.loyalityForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Loyality created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.configuration]);
      }
    });
  }



  getLoyality() {
    this.loyalityService.getLoyality().then((resp) => {
      this.loading = false;
      if (resp) {
        this.loyalitydetails = resp.data[0];
        for (let i = 0; i < this.loyalitydetails.rule.length; i++) {
          (this.loyalityForm.get('rule') as FormArray).push(
            this.fb.group({
              spending_amount: [null],
              no_of_point: [null],
              no_of_order: [null],
              start_date: [''],
              end_date: [''],
              type: ['amount'],
              paid_order: [true],
              is_active: [true]
            })
          )
        }
        this.loyalityForm.patchValue(this.loyalitydetails);
      }
    })
  }

  ngOnInit(): void {
    this.getLoyality();
  }

}
