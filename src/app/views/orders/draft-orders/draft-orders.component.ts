import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { OrdersService } from '../orders.service';


@Component({
  selector: 'app-draft-orders',
  templateUrl: './draft-orders.component.html',
  styleUrls: ['./draft-orders.component.scss']
})
export class DraftOrdersComponent implements OnInit {

  constructor(
    private router: Router,
    private ordersService: OrdersService
  ) { }

  loading: boolean = true;
  URLS = URLS;
  orders = [];
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "name",
      clickable: true
    },
    {
      title: "Date",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Customer",
      selector: "customer_name",
      cell: row => row.customer_name ? row.customer_name : "-"
    }
  ];
  pageSize: number = 20;
  totalCount: number = 0;
  page: number = 1;
  searchString: string = "";

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  onCellClick(data) {
    if(data.column === 'name') {
      this.router.navigate(["/", URLS.draftOrders, URLS.edit, data.row.id]);
    }
  }

  onSearch(data) {
    this.searchString = data.query;
    this.page = 1;
    this.getOrders();
  }

  getOrders() {
    this.loading = true;
    this.ordersService.getDraftOrders(this.page, this.pageSize, this.searchString).then(resp => {
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
