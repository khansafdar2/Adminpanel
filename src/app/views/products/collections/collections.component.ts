import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;
  searchField:FormControl = new FormControl("");
  collections = [
    {
      id: 1,
      name: "Collection 1",
      product_count: 13
    },
    {
      id: 2,
      name: "Collection 2",
      product_count: 34
    },
    {
      id: 3,
      name: "Collection 3",
      product_count: 31
    },
    {
      id: 4,
      name: "Collection 4",
      product_count: 85
    }
  ]
  selectedCollections = [];

  ngOnInit(): void {
  }

}
