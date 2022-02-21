import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../../vendors/vendors.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-product-group',
  templateUrl: './add-product-group.component.html',
  styleUrls: ['./add-product-group.component.scss']
})
export class AddProductGroupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private productsService: ProductsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private authService: AuthService,) { }

  loading: boolean = false;
  URLS = URLS;
  is_vendor = this.authService.user.is_vendor;
  vendors: [];
  vendorId = this.authService.user.vendor_id;
  productGroupForm = this.fb.group({
    title: ['', [Validators.required]],
    vendor: [null, [Validators.required]],
    tat: [""]
  });

  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      this.loading = false;
      if(resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.productsService.createProductGroup(this.productGroupForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Product group created.", "", {duration: 3000});
        this.router.navigate(["/", URLS.productGroups]);
      }
    })
  }

  ngOnInit(): void {
    if (this.is_vendor) {
      this.productGroupForm.patchValue({
        vendor:this.vendorId
      })
    } else {
      this.getVendors();
    }

  }

}
