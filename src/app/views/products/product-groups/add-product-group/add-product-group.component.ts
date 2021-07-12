import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../vendors.service';

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
    private router: Router) { }

  loading: boolean = true;
  URLS = URLS;
  vendors: [];
  productGroupForm = this.fb.group({
    title: ['', [Validators.required]],
    vendor: [null, [Validators.required]],
    is_approved: [false],
    is_active: [false]
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
    this.getVendors();
  }

}
