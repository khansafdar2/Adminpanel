import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-add-product-group',
  templateUrl: './add-product-group.component.html',
  styleUrls: ['./add-product-group.component.scss']
})
export class AddProductGroupComponent implements OnInit {

  constructor() { }

  loading: boolean = false;
  URLS = URLS;

  ngOnInit(): void {
  }

}
