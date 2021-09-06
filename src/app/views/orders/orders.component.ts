import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(
    private router: Router,
    private ordersService: OrdersService
  ) { }

  loading: boolean = true;
  URLS = URLS;
  orders = [];
  orderSelection: SelectionModel<[]> = new SelectionModel(true, []);
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "name",
      clickable: true
    },
    {
      title: "Order no.",
      selector: "order_id"
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
    if(data.column === 'name') {
      this.router.navigate(["/", URLS.orders, URLS.editMainOrder, data.row.id]);
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
      if(filter.value) {
        filterString += "&" + filter.key + "=" + filter.value;
      }
    }
    this.filterString = filterString;
    this.page = 1;
    this.getOrders();
  }

  getOrders() {
    this.loading = true;
    this.ordersService.getOrders(this.page, this.pageSize, this.searchString, this.filterString).then(resp => {
      this.loading = false;
      if(resp) {
        this.totalCount = resp.data.count;
        this.orders = resp.data.results;
      }
    });
  }

  ngOnInit(): void {
    this.getOrders();
  }

}
