import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';

const dataSource = [
  {
    id: 2,
    title: "Electronics",
    is_approved: true,
    is_active: false
  },
  {
    id: 3,
    title: "Smartphones",
    is_approved: false,
    is_active: true
  },
  {
    id: 4,
    title: "TV",
    is_approved: false,
    is_active: true
  }
];

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss']
})
export class ProductGroupsComponent implements OnInit {

  constructor(private router: Router) { }

  loading: boolean = false;
  URLS = URLS;
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => '<span class="label '+( row.is_active ? 'success' : 'warning' )+'">'+( row.is_active ? 'Yes' : 'No' )+'</span>'
    },
    {
      title: "Approved",
      selector: 'is_approved',
      cell: row => '<span class="label '+( row.is_approved ? 'success' : 'warning' )+'">'+( row.is_approved ? 'Yes' : 'No' )+'</span>'
    }
  ]
  productGroups = dataSource;
  rowActions = ["Delete"]

  onCellClick(data) {
    if(data.column === 'title') {
      this.router.navigate(['/', URLS.productGroups, URLS.edit, data.row.id]);
    }
  }

  ngOnInit(): void {
  }

}
