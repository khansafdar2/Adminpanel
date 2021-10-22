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
  homepage = {
    sections: []
  }
  activeSection = null;
  activeSectionIndex = null;

  getHomepageData() {
    this.loading = true;
    this.homepageService.getHomepage().then(resp => {
      if(resp) {
        this.homepage = resp.data;
        this.loading = false;
        console.log(resp.data);
      }
    });
  }

  setActiveSection(section, index) {
    this.activeSection = section;
    this.activeSectionIndex = index;
  }

  ngOnInit(): void {
    this.getHomepageData();
  }

}
