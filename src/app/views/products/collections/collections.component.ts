import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { FormControl } from '@angular/forms';
import { CollectionsService } from './collections.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  constructor(private collectionsService: CollectionsService) { }

  URLS = URLS;
  loading: boolean = true;
  collections = [];
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
  searchColumns = ["Title"];
  pageNumber: number = 1;
  pageSize: number = 50;


  getCollections() {
    this.loading = true;
    this.collectionsService.getCollectionsList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.collections = resp.data.results;
      }
    });
  }

  ngOnInit(): void {
    this.getCollections();
  }
}
