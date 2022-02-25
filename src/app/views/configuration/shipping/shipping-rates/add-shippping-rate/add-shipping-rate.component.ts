import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShippingService } from '../../shipping.service';
import URLS from 'src/app/shared/urls';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../../products/products.service';
import { VendorsService } from '../../../../vendors/vendors.service';

@Component({
  selector: 'add-shipping-rate',
  styleUrls: ['./add-shipping-rate.component.scss'],
  templateUrl: './add-shipping-rate.html',
})
export class AddShippingRatesComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar,
    private router: Router,
    private authservice: AuthService,
    private vendorsService: VendorsService,
    private route: ActivatedRoute,
  ) {
    this.shippingRateId = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : null;
  }
  URLS = URLS;
  is_vendor = this.authservice.user.is_vendor;
  zoneId = null;
  loading: boolean = false;
  productGroups: [];
  zones = [];
  selectedRegions: [];
  vendors: [];
  vendorID = null;
  
  shippingRateId = "";
  endPoints: string;
  errorMessage = "All product groups are associated";
  selectedProductGroups = [];
  selectedZoneId = null;
  previousZoneProductGroup = [];

  rateForm = this.fb.group({
    title: ["", [Validators.required]],
    vendor: [this.authservice.user.is_vendor ? this.authservice.user.vendor_id : '', [Validators.required]],
    zone: ["", [Validators.required]],
    product_group: [[],[Validators.required]],
    condition_type: ["", [Validators.required]],
    rules: this.fb.array([
      this.fb.group({
        title: ['', [Validators.required]],
        conditional_rates: this.fb.array([
          this.fb.group({
            min_value: ['', [Validators.required]],
            max_value: ['', [Validators.required]],
            amount: ['', [Validators.required]]
          })
        ])
      })
    ])
  });

  createNewCondition(index) {
    (this.rateForm.get('rules.' + index + '.conditional_rates') as FormArray).push(
      this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      })
    )
  }

  createNewRule() {
    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required]],
        conditional_rates: this.fb.array([
          this.fb.group({
            min_value: ['', [Validators.required]],
            max_value: ['', [Validators.required]],
            amount: ['', [Validators.required]]
          })
        ])
      })
    )
  }

  goBack() {
    this.router.navigate([URLS.shippingRates]);
  }

  deleteCondition(i, j) {
    (this.rateForm.get('rules.' + i + '.conditional_rates') as FormArray).removeAt(j);
  }

  deleteRule(i) {
    (this.rateForm.get('rules') as FormArray).removeAt(i);
  }

  duplicateRule(i) {
    let childLength2 = this.rateForm.get('rules.' + i + '.conditional_rates').value.length
    let dummy = this.fb.array([])
    for (let i = 0; i < childLength2; i++) {
      dummy.push(this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      }))
    }
    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required]],
        conditional_rates: dummy
      })
    )
    this.rateForm.get('rules.' + (this.rateForm.value.rules.length - 1)).patchValue(this.rateForm.get('rules.' + i).value)

  }

  getZones() {
    debugger
    if (this.is_vendor) {
      this.vendorID = this.authservice.user.vendor_id;
    }
    this.shippingService.getCustomZones(this.shippingRateId, this.vendorID).then(resp => {
      this.loading = false;
      if (resp) {
        this.zones = resp.data.results;
      }
    })
  }

  onZoneChange() {
    let vendor = this.rateForm.get('vendor').value;
    this.selectedZoneId = this.rateForm.get('zone').value;
    if (this.shippingRateId) {
      this.endPoints = "/shipping/shipping_productgroup_list?vendor=" + vendor + '&zone_id=' + this.selectedZoneId + '&shipping_id=' + this.shippingRateId;
    } else {
      this.endPoints = "/shipping/shipping_productgroup_list?vendor=" + vendor + '&zone_id=' + this.selectedZoneId;
    }
    if (this.zoneId == this.selectedZoneId) {
      this.selectedProductGroups = this.previousZoneProductGroup;
    } else {
      this.selectedProductGroups = [];
      this.rateForm.value.product_group = [];
    }
  }

  onVendorChange() {
    this.selectedProductGroups = [];
    this.vendorID = this.rateForm.get('vendor').value;
    this.getZones();
    this.onZoneChange();
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 250).then(resp => {
      if (resp) {
        this.vendors = resp.data.results;
        this.vendorID = resp.data.results[0].id;
        this.rateForm.patchValue({
          vendor:this.vendorID
        })
      this.vendorID = this.rateForm.get('vendor').value;
      this.getZones()
      }
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.shippingRateId) {
      //update existing shipping rate 
      this.rateForm.value.id = this.shippingRateId;
      if (this.selectedProductGroups[0].id) {
        this.rateForm.value.product_group = this.selectedProductGroups.map((ob) => ob.id)
      }

      this.shippingService.updateShippingRate(this.rateForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackbar.open("Shipping rate updates successfuly.", "", { duration: 3000 });
          this.router.navigate([URLS.shippingRates]);
        }
      })
    }
    else {
      // create new zone
      this.rateForm.value.product_group = this.selectedProductGroups.map((ob) => ob.id)
      this.shippingService.createShippingRate(this.rateForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackbar.open("shipping rate created successfuly.", "", { duration: 3000 });
          this.router.navigate([URLS.shippingRates]);
        }
      })
    }

  }

  addEmptyConditions(conditionArrayLength) {
    let dummy = this.fb.array([])
    for (let i = 0; i < conditionArrayLength; i++) {
      dummy.push(this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      }))
    }

    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required]],
        conditional_rates: dummy
      })
    )
  }

  onAddItems(e) {
    this.selectedProductGroups = [...e];
    this.rateForm.patchValue({
      product_group: this.selectedProductGroups.map((ob) => ob.id)
    }) 
  }



  ngOnInit() {
    this.loading = true
    if (this.shippingRateId) {
      // edit shipping rate 
      this.shippingService.getSingleShippingRate(this.shippingRateId).then((resp) => {
        if (resp) {
          this.loading = false;
          this.zoneId = resp.data.zone;
          (this.rateForm.get('rules') as FormArray).removeAt(0)
          if (resp.data.rules.length) {
            for (let i = 0; i < resp.data.rules.length; i++) {
              let conditionArray = resp.data.rules[i].conditional_rates.length
              this.addEmptyConditions(conditionArray)
            }
          }
          this.rateForm.patchValue(resp.data)
          this.onZoneChange();
          this.vendorID = this.rateForm.get('vendor').value;
          this.selectedProductGroups = resp.data.product_group;
          this.previousZoneProductGroup = resp.data.product_group;

          if (!this.is_vendor) {
            this.getVendors();
          } else {
            this.getZones();
          }
        }
      })
    }
    else {
      // create new shipping rate
      if (!this.is_vendor) {
        this.getVendors();
      } else {
        this.getZones();
      }
    }
  }
}