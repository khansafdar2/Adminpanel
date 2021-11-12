import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { HomepageService } from './homepage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private homepageService: HomepageService,
    private snackbar: MatSnackBar
  ) { }

  URLS = URLS;
  loading: boolean = true;
  homepage = {
    sections: []
  }
  allowedSections = [];
  activeSection = null;
  activeSectionIndex = null;

  getHomepageData() {
    this.loading = true;
    this.homepageService.getHomepage().then(resp => {
      if(resp) {
        this.homepage = resp.data.homepage;
        this.allowedSections = resp.data.allowed_sections;
        this.loading = false;
        console.log(resp.data);
      }
    });
  }

  setActiveSection(section, index) {
    this.activeSection = section;
    this.activeSectionIndex = index;
  }

  sortChanged(event: CdkDragDrop<string[]>) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    moveItemInArray(this.homepage.sections, event.previousIndex, event.currentIndex);
  }

  removeSection(index) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    this.homepage.sections.splice(index, 1);
  }

  onAddSectionClick() {

  }

  onPublish() {
    this.loading = true;
    this.homepageService.updateHomepage(this.homepage).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Homepage settings updated.", "", {duration: 2000});
      }
    });
  }

  ngOnInit(): void {
    this.getHomepageData();
  }

}


@Component({
  selector: 'homepage-add-section-dialog',
  templateUrl: './templates/homepage-add-section-dialog.html'
})
export class HomepageAddSectionDialog implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
