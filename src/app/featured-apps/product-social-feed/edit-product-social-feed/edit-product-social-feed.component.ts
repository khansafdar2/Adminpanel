import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorySelectorDialogComponent } from 'src/app/shared/category-selector-dialog/category-selector-dialog.component';
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
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  removable: boolean = true;
  categoriesTags:any[] = [];


  editproductSocialFeedForm = this.fb.group({
    id:[null],
    feed_name: ['', [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
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
  

  getProductSocialFeedDetails(){
    this.loading = true;
    this.productSocialFeedService.getSingleProductSocialFeed(this.feedId).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.exclude_tags = resp.data.exclude_tags.length ? resp.data.exclude_tags.split(",").filter(tag => tag) : [];
        let mainCategoryArray = [];
        let subCategoryArray = [];
        let superSubCategoryArray = [];

        mainCategoryArray = resp.data.main_category.map(data => { return { category_id: data.id, category_name: data.name, category_handle: data.handle, category_type: "main" } })
        subCategoryArray = resp.data.sub_category.map(data => { return { category_id: data.id, category_name: data.name, category_handle: data.handle, category_type: "sub" } })
        superSubCategoryArray = resp.data.super_sub_category.map(data => { return { category_id: data.id, category_handle: data.handle, category_name: data.name, category_type: "superSub" } })

        this.categoriesTags = this.categoriesTags.concat(mainCategoryArray);
        this.categoriesTags = this.categoriesTags.concat(subCategoryArray);
        this.categoriesTags = this.categoriesTags.concat(superSubCategoryArray);
        this.editproductSocialFeedForm.patchValue(resp.data);
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
      this.editproductSocialFeedForm.patchValue({
        main_category: this.mainCategoryID
      })
      this.subCategoryID = this.categoriesTags.filter(this.filterSubCategory).map(this.mapCategoryID);
      this.editproductSocialFeedForm.patchValue({
        sub_category: this.subCategoryID
      })
      this.superSubCategoryID = this.categoriesTags.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
      this.editproductSocialFeedForm.patchValue({
        super_sub_category: this.superSubCategoryID
      })
    });
  }


  removeChip(index, data) {
    this.categoriesTags.splice(index, 1);
    if(data) {
      if(data.category_type == "main") {
        let mainCategoryID = this.editproductSocialFeedForm.get("main_category").value;
        mainCategoryID.splice(data.category_id);
        this.editproductSocialFeedForm.patchValue({
          main_category: this.mainCategoryID
        })
      } else if (data.category_type == "sub") {
        let subCategoryID = this.editproductSocialFeedForm.get("sub_category").value;
        subCategoryID.splice(data.category_id);
        this.editproductSocialFeedForm.patchValue({
          sub_category: this.subCategoryID
        })
      } else if (data.category_type == "superSub") {
        let superSubCategoryID = this.editproductSocialFeedForm.get("super_sub_category").value;
        superSubCategoryID.splice(data.category_id);
        this.editproductSocialFeedForm.patchValue({
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



  onSubmit(){
    this.loading = true;
    let productData = this.editproductSocialFeedForm.value;
    if (productData.product_export == "all") {
      productData.main_category = [];
      productData.sub_category = [];
      productData.super_sub_category = [];
      
    } else if (productData.product_export == "category") {
      productData.main_category = this.categoriesTags.filter(this.filterMainCategory).map(this.mapCategoryID);
      productData.sub_category = this.categoriesTags.filter(this.filterSubCategory).map(this.mapCategoryID);
      productData.super_sub_category = this.categoriesTags.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    }

    productData.exclude_tags = this.exclude_tags.length ? this.exclude_tags.join(",") : "";
    this.productSocialFeedService.updateProductSocialFeed(productData).then((resp)=>{
      this.loading = false;
      if(resp) {
      console.log(this.editproductSocialFeedForm.value);
        this.snackbarService.open("Product social feed updated successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.productSocialFeed]);
      }
    })
  }


  ngOnInit(): void {
    this.getProductSocialFeedDetails();
  }

}