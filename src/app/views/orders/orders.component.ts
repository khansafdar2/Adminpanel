import { AuthService } from 'src/app/auth/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products/products.service';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  loading: boolean = true;
  URLS = URLS;
  orders = [];
  is_vendor = this.authService.user.is_vendor;
  orderSelection: SelectionModel<[]> = new SelectionModel(true, []);
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "name",
      clickable: true
    },
    {
      title: "Order no.",
      selector: "order_id",
    },
    {
      title: "Date",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Customer",
      selector: "customer_name"
    },
    {
      title: "Total",
      selector: "total_price"
    },
    {
      title: "Payment",
      selector: "payment_status",
      label: true,
      labelStyles: {
        "Pending": "default",
        "Paid": "success",
        "Partially Paid": "warning"
      }
    },
    {
      title: "Fulfillment",
      selector: "fulfillment_status",
      label: true,
      labelStyles: {
        "Unfulfilled": "default",
        "Fulfilled": "success",
        "Partially Fulfilled": "warning"
      }
    },
    {
      title: "Order status",
      selector: "order_status",
      label: true,
      labelStyles: {
        "Open": "success",
        "Accepted": "success",
        "In Process": "success",
        "Shipped": "success",
        "Partial Shipped": "warning",
        "Delivered": "success",
        "Returned": "default",
        "Refunded": "default",
        "Cancelled": "default"
      }
    }
  ];
  pageSize: number = 20;
  totalCount: number = 0;
  page: number = 1;
  searchString: string = "";
  filterString: string = "";
  searchColumns = [
    {
      label: "Name",
      value: "name"
    },
    {
      label: "Order No.",
      value: "order_id"
    }
  ];
  filtersArray = [
    {
      title: "Fulfillment status",
      key: 'fulfillment_status',
      values: [
        {
          label: "Fulfilled",
          value: "fulfilled"
        },
        {
          label: "Partially fulfilled",
          value: "partially_fulfilled"
        },
        {
          label: "Unfulfilled",
          value: "unfulfilled"
        }
      ]
    },
    {
      title: "Payment status",
      key: "payment_status",
      values: [
        {
          label: "Paid",
          value: "paid"
        },
        {
          label: "Partially paid",
          value: "partially_paid"
        },
        {
          label: "Pending",
          value: "pending"
        }
      ]
    }
  ]

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  onCellClick(data) {
    if (data.column === 'name') {
      if (this.is_vendor) {
        this.router.navigate(["/", URLS.orders, URLS.editChildOrder, data.row.id]);
      } else {
        this.router.navigate(["/", URLS.orders, URLS.editMainOrder, data.row.id]);
      }
    }
  }

  onSearch(data) {
    this.searchString = data.query.replaceAll("#", "") + "&column=" + data.column;
    this.page = 1;
    this.getOrders();
  }

  onFilter(appliedFilters) {
    let filterString = "";
    for (let i = 0; i < appliedFilters.length; i++) {
      const filter = appliedFilters[i];
      if (filter.value) {
        filterString += "&" + filter.key + "=" + filter.value;
      }
    }
    this.filterString = filterString;
    this.page = 1;
    this.getOrders();
  }

  onExport() {
    let dialogRef = this.dialog.open(OrdersExportDialog, {
      width: "600px",
      data: {
        orders: this.orderSelection.selected
      }
    });
    dialogRef.afterClosed().subscribe(exported => {
      if (exported) {
        this.orderSelection.clear();
      }
    });
  }

  getOrders() {
    this.loading = true;
    let orderservice;
    if (this.is_vendor) {
      orderservice = this.ordersService.getVendorOrder(this.page, this.pageSize, this.searchString, this.filterString);
    } else {
      orderservice = this.ordersService.getOrders(this.page, this.pageSize, this.searchString, this.filterString);
    }
    orderservice.then(resp => {
      this.loading = false;
      if (resp) {
        this.totalCount = resp.data.count;
        this.orders = resp.data.results;
      }
    });
  }

  ngOnInit(): void {
    this.getOrders();
    if (this.is_vendor) {
      this.displayedColumns.splice(1,1);
    }
  }

}


@Component({
  selector: 'orders-export-dialog',
  templateUrl: './dialogs/orders-export-dialog.html',
})
export class OrdersExportDialog {
  constructor(
    public dialogRef: MatDialogRef<OrdersExportDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private ordersService: OrdersService
  ) {
    let idsArray = this.data.orders.map(order => order.id);
    this.ids = idsArray.join(",");
  }

  loading: boolean = false;
  ids: string = "";
  exportType = "all";

  onExport() {
    this.loading = true;
    this.ordersService.exportOrders(this.exportType === "all" ? "all" : this.ids).then(resp => {
      this.loading = false;
      if (resp) {
        let csv_data = resp.data;
        var fileURL = window.URL.createObjectURL(new Blob([csv_data], { type: 'text/csv;charset=utf-8;' }));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'export_orders.csv');
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
        this.dialogRef.close(true);
      }
    });
  }
}
