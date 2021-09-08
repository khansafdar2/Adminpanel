import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { DiscountsService } from './discounts.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {

  constructor(
    private discountsService: DiscountsService,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    // {
    //   title: "Type",
    //   selector: "discount_type",
    //   cell: row => row.discount_type === "percentage" ? "Percentage" : "Amount"
    // },
    {
      title: "Discount value",
      selector: "type_value",
      cell: row => row.discount_type === "percentage" ? row.type_value + "%" : row.type_value + " QAR"
    }
  ];
  discounts = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getDiscountsList() {
    this.loading = true;
    this.discountsService.getDiscountsList().then(resp => {
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
    this.getDiscountsList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.discounts, URLS.edit, data.row.id]);
  }

  ngOnInit(): void {
    this.getDiscountsList();
  }

}
