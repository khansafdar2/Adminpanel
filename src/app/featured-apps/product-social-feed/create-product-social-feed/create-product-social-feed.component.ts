import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { ProductSocialFeedService } from '../product-social-feed.service';


@Component({
  selector: 'app-create-product-social-feed',
  templateUrl: './create-product-social-feed.component.html',
  styleUrls: ['./create-product-social-feed.component.scss']
})
export class CreateProductSocialFeedComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackbarService: MatSnackBar,
    private productSocialFeedService: ProductSocialFeedService,
    public dialog: MatDialog
  ) { }

  URLS = URLS;
  loading = false;
  storeCurrency = environment.currency;
  loyalityDetails: any;
  ruleID:any;

  exclude_tags:string[] = [];


  productSocialFeedForm = this.fb.group({
    feed_name: [''],
    feed_type: [''],
    export_mode:['all'],
    export_variant:['first variant'] ,
    use_price: ['both'],
    currency: [''],
    product_export: ['all'],
    custom_label1: [''],
    custom_label2: [''],
    custom_label3: [""],
    custom_label4: [''],
    feed_link: [null],
    in_stock: ["true"],
  })



  onSubmit(){
    this.loading = true;
    let productData = this.productSocialFeedForm.value;
    productData.exclude_tags = this.exclude_tags.length ? this.exclude_tags.join(",") : "";
    this.productSocialFeedService.createProductSocialFeed(productData).then((resp)=>{
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Product social feed created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.productSocialFeed]);
      }
    })
  }

  ngOnInit(): void {
  }

}
