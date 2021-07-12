import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss']
})
export class ProductGroupsComponent implements OnInit {

  constructor(
    private router: Router,
    private productsService: ProductsService) { }

  loading: boolean = true;
  URLS = URLS;
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true
    },
    {
      title: "Vendor",
      selector: "vendor_name"
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => '<span class="label '+( row.is_active ? 'success' : '' )+'">'+( row.is_active ? 'Active' : 'Inactive' )+'</span>'
    },
    {
      title: "Approved",
      selector: 'is_approved',
      cell: row => '<span class="label '+( row.is_approved ? 'success' : '' )+'">'+( row.is_approved ? 'Yes' : 'No' )+'</span>'
    }
  ]
  productGroups = [];
  rowActions = ["Delete"];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  onCellClick(data) {
    if(data.column === 'title') {
      this.router.navigate(['/', URLS.productGroups, URLS.edit, data.row.id]);
    }
  }

  getProductGroups() {
    this.loading = true;
    this.productsService.getProductGroups(this.pageNumber, this.pageSize, "", "").then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.totalCount = resp.data.count;
        this.productGroups = resp.data.results;
      }
    })
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getProductGroups();
  }

  ngOnInit(): void {
    this.getProductGroups();
  }

}
