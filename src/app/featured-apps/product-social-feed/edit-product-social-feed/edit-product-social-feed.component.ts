import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { ProductSocialFeedService } from '../product-social-feed.service';


@Component({
  selector: 'app-edit-product-social-feed',
  templateUrl: './edit-product-social-feed.component.html',
  styleUrls: ['./edit-product-social-feed.component.scss']
})
export class EditProductSocialFeedComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackbarService: MatSnackBar,
    private productSocialFeedService: ProductSocialFeedService,
    public dialog: MatDialog,
    private route: ActivatedRoute,

  ) {
    this.feedId = this.route.snapshot.params.id;
   }

  URLS = URLS;
  loading = false;
  productSocialFeedDetail: any;
  feedId:any;
  exclude_tags:string[] = [];


  editproductSocialFeedForm = this.fb.group({
    id:[null],
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

  getProductSocialFeedDetails(){
    this.loading = true;
    this.productSocialFeedService.getSingleProductSocialFeed(this.feedId).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.exclude_tags = resp.data.exclude_tags.length ? resp.data.exclude_tags.split(",").filter(tag => tag) : [];
        this.editproductSocialFeedForm.patchValue(resp.data);
      }
    })
  }

  onSubmit(){
    this.loading = true;
    let productData = this.editproductSocialFeedForm.value;
    productData.exclude_tags = this.exclude_tags.length ? this.exclude_tags.join(",") : "";
    this.productSocialFeedService.updateProductSocialFeed(productData).then((resp)=>{
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Product social feed updated successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.productSocialFeed]);
      }
    })
  }

  ngOnInit(): void {
    this.getProductSocialFeedDetails();
  }

}
