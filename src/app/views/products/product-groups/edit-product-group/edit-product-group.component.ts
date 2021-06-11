import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-edit-product-group',
  templateUrl: './edit-product-group.component.html',
  styleUrls: ['./edit-product-group.component.scss']
})
export class EditProductGroupComponent implements OnInit {

  constructor() { }

  loading: boolean = false;
  URLS = URLS;

  ngOnInit(): void {
  }

}
