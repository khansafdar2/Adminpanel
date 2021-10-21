import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { HomepageService } from './homepage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private homepageService: HomepageService
  ) { }

  URLS = URLS;
  loading: boolean = true;

  getHomepageData() {
    this.loading = true;
    this.homepageService.getHomepage().then(resp => {
      if(resp) {
        this.loading = false;
        console.log(resp.data);
      }
    });
  }

  ngOnInit(): void {
    this.getHomepageData();
  }

}
