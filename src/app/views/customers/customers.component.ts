import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(
    private customersService: CustomersService,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;
  customers = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;
  displayedColumns: Column[] = [
    {
      title: "Name",
      selector: "first_name",
      cell: row => row.first_name + " " + row.last_name,
      clickable: true
    },
    {
      title: "Email",
      selector: "email"
    },
    {
      title: "Phone",
      selector: "phone"
    }
  ];

  getCustomers() {
    this.loading = true;
    this.customersService.getCustomersList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.customers = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCustomers();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.customers, URLS.edit, data.row.id]);
  }

  ngOnInit(): void {
    this.getCustomers();
  }

}
