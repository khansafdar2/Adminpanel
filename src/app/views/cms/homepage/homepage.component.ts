import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private dialog: MatDialog,
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
        this.allowedSections = resp.data.allowed_sections.allowed_sections;
        this.loading = false;
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
    let dialogRef = this.dialog.open(HomepageAddSectionDialog, {
      width: "600px",
      data: {
        allowedSections: this.allowedSections
      }
    });

    dialogRef.afterClosed().subscribe(section => {
      if(section) {
        this.homepage.sections.push(section);
      }
    });
  }

  onPublish() {
    this.loading = true;
    this.homepageService.updateHomepage({homepage:this.homepage}).then(resp => {
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
  constructor(
    public dialogRef: MatDialogRef<HomepageAddSectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar
  ) { }

  _defaultSections = [
    {
      type: "banner_slider",
      title: "Banner slider",
      slides: []
    },
    {
      type: "categories_carousel",
      title: "Categories carousel",
      categories: []
    },
    {
      type: "brands_slider",
      title: "Brands",
      brands: []
    },
    {
      type: "products_carousel",
      title: "Products carousel",
      category_handle: "",
      products: [
        {
          "img": "url",
          "name": "text",
          "handle": "text",
          "price": {
            "original_price": "number",
            "compare_price": "number"
          }
        }
      ]
    },
    {
      type: "single_banner",
      title: "Banner section",
      desktop_img: "",
      mobile_img: "",
      link: "",
      single_banner_text_alt:""
    },
    {
      type: "categories_tabs",
      title: "Categories tabs",
      banner_img: "",
      categories: []
    },
    {
      type: "two_banners",
      title: "Two banners section",
      first_banner: {
        desktop_img: "",
        mobile_img: "",
        link: "",
        banner_alt_text:""
      },
      second_banner: {
        desktop_img: "",
        mobile_img: "",
        link: "",
        banner_alt_text:""
      }
    },
    {
      type: "features_icons",
      title: "Feature icons",
      features: []
    }
  ]

  addSection(section) {
    this.snackbar.open("Section added.", "", {duration: 1000});
    this.dialogRef.close(section);
  }

  ngOnInit(): void {
  }
}
