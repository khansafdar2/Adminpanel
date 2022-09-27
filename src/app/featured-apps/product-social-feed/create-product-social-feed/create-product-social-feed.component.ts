import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategorySelectorDialogComponent } from 'src/app/shared/category-selector-dialog/category-selector-dialog.component';
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
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  removable: boolean = true;
  exclude_tags:string[] = [];
  categoriesTags:any[] = [];
  // newList:string[] = [];
  // isBigEnough(value) {
  //   return value === "category_handle";
  // }
  // show(){

  // }



  
  





  productSocialFeedForm = this.fb.group({
    feed_name: ['', [Validators.required, , Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    feed_type: ['', [Validators.required]],
    export_mode:['all'],
    export_variant:['first variant'] ,
    use_price: ['both'],
    product_export: ['all'],
    custom_label1: [''],
    custom_label2: [''],
    custom_label3: [""],
    custom_label4: [''],
    feed_link: [null],
    in_stock: ["true"],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
  })

  showValue(){
    console.log(this.productSocialFeedForm);
  }

  mapProductID(value) {
    return value.id;
  }

  mapCategoryID(value) {
    return value.category_id;
  }

  filterMainCategory(value) {
    return value.category_type == "main";
  }

  filterSubCategory(value) {
    return value.category_type == "sub";
  }

  filterSuperSubCategory(value) {
    return value.category_type == "superSub";
  }
  


  onSubmit(){
    this.loading = true;
    let productData = this.productSocialFeedForm.value;
    if (productData.product_export == "all") {
      productData.main_category = [];
      productData.sub_category = [];
      productData.super_sub_category = []; 
    }
    productData.exclude_tags = this.exclude_tags.length ? this.exclude_tags.join(",") : "";
    this.productSocialFeedService.createProductSocialFeed(productData).then((resp)=>{
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Product social feed created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.productSocialFeed]);
      }
    })
  }

  categorySelector() {
    let dialogRef = this.dialog.open(CategorySelectorDialogComponent, {
      width: "600px",
      data: {
        selected: this.categoriesTags.map(this.mapHandle),
        valueType: "object.handle",
        multiple: true
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      this.categoriesTags = value.map(this.mapCategoryHandle);
      console.log(this.categoriesTags);
      this.mainCategoryID = this.categoriesTags.filter(this.filterMainCategory).map(this.mapCategoryID);
      this.productSocialFeedForm.patchValue({
        main_category: this.mainCategoryID
      })
      this.subCategoryID = this.categoriesTags.filter(this.filterSubCategory).map(this.mapCategoryID);
      this.productSocialFeedForm.patchValue({
        sub_category: this.subCategoryID
      })
      this.superSubCategoryID = this.categoriesTags.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
      this.productSocialFeedForm.patchValue({
        super_sub_category: this.superSubCategoryID
      })
    });
  }



  removeChip(index, data) {
    this.categoriesTags.splice(index, 1);
    if(data) {
      if(data.category_type == "main") {
        let mainCategoryID = this.productSocialFeedForm.get("main_category").value;
        mainCategoryID.splice(data.category_id);
        this.productSocialFeedForm.patchValue({
          main_category: this.mainCategoryID
        })
      } else if (data.category_type == "sub") {
        let subCategoryID = this.productSocialFeedForm.get("sub_category").value;
        subCategoryID.splice(data.category_id);
        this.productSocialFeedForm.patchValue({
          sub_category: this.subCategoryID
        })
      } else if (data.category_type == "superSub") {
        let superSubCategoryID = this.productSocialFeedForm.get("super_sub_category").value;
        superSubCategoryID.splice(data.category_id);
        this.productSocialFeedForm.patchValue({
          super_sub_category: this.superSubCategoryID
        })
      }
    }  
  }

  mapHandle(data) {
    let newobj = {"category_id": data.category_id, "handle": data.category_handle,"category_name": data.category_name, "category_type": data.category_type}
    return newobj
  }

  mapCategoryHandle(data) {
    let newobj;
    if (data.category_handle) {
      newobj = {"category_id": data.category_id, "category_handle": data.category_handle,"category_name": data.category_name, "category_type": data.category_type}
    } else {
      newobj = {"category_id": data.category_id, "category_handle": data.handle,"category_name": data.category_name, "category_type": data.category_type}
    }
    return newobj
  }

  ngOnInit(): void {
    // this.show();
  }

}
