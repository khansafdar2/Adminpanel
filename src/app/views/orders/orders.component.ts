import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor() { }

  loading: boolean = false;
  URLS = URLS;
  orders = [
    {
      title: "#JO4002",
      created_at: "Today at 5:34 pm",
      customer_name: "Fatima Tahavi",
      total: 12450,
      payment_status: "Pending",
      fulfillment_status: "Unfulfilled"
    },
    {
      title: "#JO4003",
      created_at: "Today at 5:36 pm",
      customer_name: "Zoryan Warlani",
      total: 456,
      payment_status: "Pending",
      fulfillment_status: "Unfulfilled"
    },
    {
      title: "#JO4005",
      created_at: "Today at 6:43 pm",
      customer_name: "Imran Javaid",
      total: 7769,
      payment_status: "Paid",
      fulfillment_status: "Unfulfilled"
    },
    {
      title: "#JO4006",
      created_at: "Today at 6:43 pm",
      customer_name: "Rizwan Ghani",
      total: 8879,
      payment_status: "Pending",
      fulfillment_status: "Fulfilled"
    }
  ];
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "title"
    },
    {
      title: "Date",
      selector: "created_at"
    },
    {
      title: "Customer",
      selector: "customer_name"
    },
    {
      title: "Total",
      selector: "total"
    },
    {
      title: "Payment",
      selector: "payment_status",
      label: true,
      labelStyles: {
        "Pending": "default",
        "Paid": "success"
      }
    },
    {
      title: "Fulfillment",
      selector: "fulfillment_status",
      label: true,
      labelStyles: {
        "Unfulfilled": "default",
        "Fulfilled": "success"
      }
    }
  ];
  pageSize: number = 15;
  totalCount: number = 4;
  page: number = 1;

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  ngOnInit(): void {
  }

}
