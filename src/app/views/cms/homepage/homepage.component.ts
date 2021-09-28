import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;

  ngOnInit(): void {
  }

}
