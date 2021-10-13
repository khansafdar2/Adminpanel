import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { VendorsService } from './vendors.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  constructor(
    private vendorsService: VendorsService,
    private router: Router,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  searchString: string = "";
  pageSize: number = 20;
  totalCount: number = 0;
  page: number = 1;
  vendors = []; 
  filterString = '';

  orderSelection: SelectionModel<[]> = new SelectionModel(true, []);

  displayedColumns: Column[] = [
    {
      title: "Name",
      selector: "name",
      clickable: true
    },
    {
      title: "Email",
      selector: "email"
    },
    {
      title: "Date",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Is Active",
      selector: "is_active",
      label: true,
      labelStyles: {
        "false": "default",
        "true": "success"
      }
    }
  ];

  filtersArray = [
    {
      title: "Status",
      key: "status",
      values: [
        {
          label: "Active",
          value: "active"
        },
        {
          label: "Inactive",
          value: "inactive"
        }
      ]
    }
    // ,
    // {
    //   title: "Approval status",
    //   key: "approval_status",
    //   values: [
    //     {
    //       label: "Approved",
    //       value: "approved"
    //     },
    //     {
    //       label: "Disapproved",
    //       value: "disapproved"
    //     }
    //   ]
    // }
  ]

  searchColumns = [
    {
      label: "Name",
      value: "name"
    },
    {
      label: "Email",
      value: "email"
    }
  ];

  onFilter(filters) {
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if(filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getVendors();
  }

  onCellClick(data) {
    // if(data.column === 'name') {
      this.router.navigate(["/", URLS.vendors, URLS.edit, data.row.id]);
    // }
  }

  onSearch(data) {
    this.searchString = data.query.replaceAll("#", "") + "&column=" + data.column;
    this.page = 1;
    this.getVendors();
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getVendors();
  }

  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(this.page, this.pageSize, this.searchString, this.filterString).then(resp => {
      this.loading = false;
      if(resp) {
        this.totalCount = resp.data.count;
        this.vendors = resp.data.results;
        console.log(resp)
      }
    });
  }

  

  ngOnInit(): void {
    this.getVendors();
  }

}
