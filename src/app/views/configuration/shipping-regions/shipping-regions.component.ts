import { ShippingRegionService } from './shipping-region.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-shipping-regions',
  templateUrl: './shipping-regions.component.html',
  styleUrls: ['./shipping-regions.component.scss']
})
export class ShippingRegionsComponent implements OnInit {

  constructor(
    private shippingRegionService: ShippingRegionService,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Name",
      selector: "name",
      clickable: true
    },
  ];
  shippingRegion = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getShippingRegionList() {
    this.loading = true;
    this.shippingRegionService.getShippingRegionList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if (resp) {
        this.shippingRegion = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getShippingRegionList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.country, data.row.id]);
  }

  ngOnInit(): void {
    this.getShippingRegionList();
  }

}
