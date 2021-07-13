import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { BrandsService } from './brands.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  constructor(
    private brandsService: BrandsService,
    private router: Router
  ) { }

  URLS = URLS;
  loading: boolean = false;
  brands = [];
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "image",
      cell: row => `<img src="${row.image ? row.image.cdn_link : '/assets/img/placeholder-image.png'}" class="table-row-thumbnail" />`,
      width: "50px"
    },
    {
      title: "Name",
      selector: "name",
      clickable: true
    }
  ];
  pageSize: number = 20;
  totalCount: number = 0;
  pageNumber: number = 1;

  onCellClick(data) {
    if(data.column === "name") {
      this.router.navigate(["/", URLS.brands, URLS.edit, data.row.id]);
    }
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getBrands();
  }

  getBrands() {
    this.loading = true;
    this.brandsService.getBrandsList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.brands = resp.data.results;
        this.totalCount = resp.data.count;
        console.log(resp.data);
      }
    });
  }

  ngOnInit(): void {
    this.getBrands();
  }

}
