import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { VendorsService } from '../../vendors.service';


@Component({
  selector: 'app-edit-product-group',
  templateUrl: './edit-product-group.component.html',
  styleUrls: ['./edit-product-group.component.scss']
})
export class EditProductGroupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private productsService: ProductsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.groupID = this.route.snapshot.paramMap.get("id");
  }

  groupID = null;
  loading: boolean = true;
  URLS = URLS;
  vendors: [];
  productGroupForm = this.fb.group({
    id: [null],
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

  getProductGroupDetails() {
    this.loading = true;
    this.productsService.getProductGroupDetail(this.groupID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.productGroupForm.patchValue(resp.data);
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.productsService.updateProductGroup(this.productGroupForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Group updated successfully.", "", {duration: 3000});
      }
    });
  }

  ngOnInit(): void {
    this.getVendors();
    this.getProductGroupDetails();
  }

}
