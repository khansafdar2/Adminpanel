import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductSocialFeedService } from '../product-social-feed.service';

@Component({
  selector: 'app-product-social-feed',
  templateUrl: './product-social-feed.component.html',
  styleUrls: ['./product-social-feed.component.scss']
})
export class ProductSocialFeedComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: MatSnackBar,
    private productSocialFeedService: ProductSocialFeedService,
    public dialog: MatDialog,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Title",
      selector: "feed_name",
      clickable: true
    },
    {
      title: "Number of Products",
      selector: "no_of_products",
    },
    {
      title: "Feed status",
      selector: "feed_status",
      cell: row => `<span class="label ${row.feed_status == 'OK' ? 'success' : row.feed_status == 'pending' ? 'warning': ''}">${row.feed_status == 'Ok' ? 'Approved' : row.feed_status == 'pending' ? 'Pending': row.feed_status}</span>`
    },
    {
      title: "Created at",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Updated at",
      selector: "updated_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Product Feed Link",
      selector: "feed_link",
      clickable: true,
      cell: row => row.feed_link? "Copy link": ''
    },
  ];

  productSocialFeed = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions = ["Delete"];


  getProductSocialFeedList() {
    this.loading = true;
    this.productSocialFeedService.getProductSocialFeedList().then(resp => {
      this.loading = false;
      if (resp) {
        this.productSocialFeed = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getProductSocialFeedList();
  }

  onCellClick(data) {
    if(data.column === 'feed_name') {
      this.router.navigate(["/", URLS.productSocialFeed, URLS.edit, data.row.id]);
    } else if (data.column === 'feed_link') {
      navigator.clipboard.writeText(data.row.feed_link);
      this.snackbarService.open("Link copied to clipboard.", "", { duration: 1500 });

    }
  }

  onRowAction(data) {
    if (data.action === "Delete") {
      let dialogRef = this.dialog.open(SocialFeedDeleteDialog, {
        width: "600px",
        data: {
          feed: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getProductSocialFeedList();
        }
      });
    }
  };


  socialSettingFeedForm = this.fb.group({
    price_format: [2],
    export_products: ['active'],
    export_gender: ["vendor"]
  })
  
  getProductSocialFeedDetails(){
    this.loading = true;
    this.productSocialFeedService.getSingleSettingProductSocialFeed().then((resp)=>{
      this.loading = false;
      if (resp) {
        this.socialSettingFeedForm.patchValue(resp.data);
      }
    })
  }

  onSubmit(){
    this.loading = true;
    this.productSocialFeedService.createProductSettingSocialFeed(this.socialSettingFeedForm.value).then((resp)=>{
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Setting created successfully.", "", { duration: 3000 });
      }
    })
  }
  ngOnInit(): void {
    this.getProductSocialFeedList();
    this.getProductSocialFeedDetails();
  }

}



@Component({
  selector: 'delete-social-feed-dialog',
  templateUrl: '../dialogs/delete-social-feed-dialog.html',
})
export class SocialFeedDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<SocialFeedDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productSocialFeedService: ProductSocialFeedService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.productSocialFeedService.deleteFeed(this.data.feed.id).then(resp => {
      if (resp) {
        this.loading = false;
        this.snackBar.open("Size chart deleted.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }
}