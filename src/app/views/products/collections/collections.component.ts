import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { CollectionsService } from './collections.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { VendorsService } from '../vendors.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  constructor(private collectionsService: CollectionsService, private router: Router, private vendorsService: VendorsService) { }

  URLS = URLS;
  loading: boolean = true;
  collections = [];
  vendors = [];
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: "title"
    },
    {
      title: "",
      selector: "product_count",
      cell: row =>  row.product_count + ' products'
    }
  ]
  collectionSelection: SelectionModel<[]> = new SelectionModel(true, []);
  searchColumns = [
    {
      label: "Title",
      value: "title"
    }
  ];
  rowActions: string[] = ["Edit", "Delete"];
  filtersArray = [
    {
      title: "Vendor",
      key: 'vendor',
      values: []
    }
  ]
  filterString: string = "";
  searchString: string = "";
  pageNumber: number = 1;
  pageSize: number = 50;


  getCollections() {
    this.loading = true;
    this.collectionsService.getCollectionsList(this.pageNumber, this.pageSize, this.filterString, this.searchString).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.collections = resp.data.results;
      }
    });
  }

  getVendorsList() {
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        this.vendors = resp.data.results;
        let tempVendors = [];
        tempVendors = this.vendors.map(vendor => vendor.name);
        this.filtersArray[0].values = tempVendors;
      }
    })
  }

  onFilter(filters) {
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if(filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getCollections();
  }

  onSearch(data) {
    console.log(data);
    let tempSearchString = "";
    if(data.query) {
      tempSearchString += "&search=" + data.query + "&column=" + data.column;
    }
    this.searchString = tempSearchString;
    this.getCollections();
  }

  onRowAction(data) {
    if(data.action === "Edit") {
      this.router.navigate(['/', URLS.collections, URLS.edit, data.row.id]);
    }
  }

  ngOnInit(): void {
    this.getCollections();
    this.getVendorsList();
  }
}
