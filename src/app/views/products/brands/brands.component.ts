import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;
  brands = [];
  displayedColumns: Column[] = [];
  pageSize: number = 20;
  totalCount: number = 0;
  pageNumber: number = 1;

  onPage(event: PageEvent) {
    
  }

  ngOnInit(): void {
  }

}
