import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { GeneralInformationService } from './general-information.service';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  constructor(
    private router: Router,
    private generalInfoService: GeneralInformationService,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar) { }

  loading: boolean = true;
  storeInfo = {}
  storeInfoForm = this.fb.group({
    id: [null],
    store_name: ['', [Validators.required]],
    store_contact_email: ['', [Validators.required, Validators.email]],
    sender_email: ['', [Validators.required, Validators.email]],
    store_industry: ['', [Validators.required]],
    company_name: ['', [Validators.required]],
    phone_number: ['', [Validators.required]],
    address1: ['', [Validators.required]],
    address2: [''],
    country: ['', [Validators.required]],
    postal_code: ['', [Validators.required]],
    time_zone: ['', [Validators.required]],
    unit_system: ['', [Validators.required]],
    weight_units: ['', [Validators.required]],
    main_order_prefix: [''],
    split_order_prefix: [''],
    store_currency: ['', [Validators.required]]
  });

  goBack() {
    this.router.navigate([URLS.configuration]);
  }

  ngOnInit(): void {
    this.getInfo()
  }

  getInfo() {
    this.loading = true;
    this.generalInfoService.getStoreInfo().then(resp => {
      if(resp) {
        this.storeInfo = resp.data;
        this.storeInfoForm.patchValue(resp.data);
        if(resp.data.id) {
          this.storeInfoForm.controls['country'].disable();
          this.storeInfoForm.controls['postal_code'].disable();
          this.storeInfoForm.controls['time_zone'].disable();
          this.storeInfoForm.controls['unit_system'].disable();
          this.storeInfoForm.controls['weight_units'].disable();
          this.storeInfoForm.controls['store_currency'].disable();
        }
        this.loading = false;
      }
    });
  }

  saveInfo() {
    this.generalInfoService.updateStoreInfo(this.storeInfoForm.value).then(resp => {
      if(resp) {
        this.snackbarService.open("Settings updated.", "", {duration: 3000});
        this.goBack();
      }
    })
  }
}
