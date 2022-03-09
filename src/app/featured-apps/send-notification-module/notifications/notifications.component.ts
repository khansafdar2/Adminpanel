import { NotificationService } from './../notification.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = false;
  URLS = URLS;
  storeCurrency = environment.currency;
  columns: Column[] = [
    {
      title: "Title",
      selector: "message_title",
      clickable: true
    },
    
  ];
  discounts = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getNotificationList() {
    this.loading = true;
    this.notificationService.getNotificationList().then(resp => {
      this.loading = false;
      if(resp) {
        this.discounts = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getNotificationList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.discounts, URLS.edit, data.row.id]);
  }

  onRowAction(data) {
    // if(data.action === "Delete") {
    //   let dialogRef = this.dialog.open(DiscountDeleteDialog, {
    //     width: "600px",
    //     data: {
    //       discount: data.row
    //     }
    //   });

    //   dialogRef.afterClosed().subscribe(deleted => {
    //     if(deleted) {
    //       this.getDiscountsList();
    //     }
    //   });
    // }
  }


  ngOnInit(): void {
    this.getNotificationList();
  }

}


// @Component({
//   selector: 'discount-delete-dialog',
//   templateUrl: './dialogs/discount-delete-dialog.html',
// })
// export class DiscountDeleteDialog {
//   constructor(
//     public dialogRef: MatDialogRef<DiscountDeleteDialog>,
//     @Inject(MAT_DIALOG_DATA) public data,
//     private discountService: DiscountsService,
//     private snackBar: MatSnackBar
//   ) {}

//   loading: boolean = false;

//   onDelete() {
//     this.loading = true;
//     this.discountService.deleteDiscount(this.data.discount.id).then(resp => {
//       if(resp) {
//         this.snackBar.open("Discount deleted.", "", {duration: 2000});
//         this.dialogRef.close(true);
//       }
//     })
//   }
// }
