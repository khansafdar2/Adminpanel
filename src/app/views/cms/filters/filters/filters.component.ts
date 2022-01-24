import URLS from 'src/app/shared/urls';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { HomepageService } from './homepage.service';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(
    // private homepageService: HomepageService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  URLS = URLS;

  loading: boolean = false;
  filters = []
  allowedFilters = [];
  activeSection = null;
  activeSectionIndex = null;

  getHomepageData() {
    // this.loading = true;
    // this.homepageService.getHomepage().then(resp => {
    //   if(resp) {
    //     this.homepage = resp.data.homepage;
    //     this.allowedFilters = resp.data.allowed_sections.allowed_sections;
    //     this.loading = false;
    //   }
    // });
  }

  setActiveSection(section, index) {
    this.activeSection = section;
    this.activeSectionIndex = index;
  }

  sortChanged(event: CdkDragDrop<string[]>) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    moveItemInArray(this.filters, event.previousIndex, event.currentIndex);
  }

  removeSection(index) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    this.filters.splice(index, 1);
  }

  onAddSectionClick() {
    let dialogRef = this.dialog.open(AddFilterDialog, {
      width: "600px",
      data: {
        allowedFilters: this.allowedFilters
      }
    });

    dialogRef.afterClosed().subscribe(section => {
      if(section) {
        this.filters.push(section);
      }
    });
  }

  onPublish() {
    this.loading = true;
    debugger
    // this.homepageService.updateHomepage({homepage:this.homepage}).then(resp => {
    //   this.loading = false;
    //   if(resp) {
    //     this.snackbar.open("Homepage settings updated.", "", {duration: 2000});
    //   }
    // });
  }

  ngOnInit(): void {
    this.getHomepageData();
  }


  // ngOnInit(): void {
  // }

}

@Component({
  selector: 'add-filter-dialog',
  templateUrl: './dialogs/add-filter-dialog.html'
})
export class AddFilterDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddFilterDialog>,
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
      link: ""
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
        link: ""
      },
      second_banner: {
        desktop_img: "",
        mobile_img: "",
        link: ""
      }
    },
    {
      type: "features_icons",
      title: "Feature icons",
      features: []
    }
  ]

  filterTypes = [
    {
      type: "price",
      title: "Price",
      is_active : false
    },
    {
      type: "collection",
      title: "Collection",
      is_active : false
    },
    {
      type: "brand",
      title: "Brand",
      is_active : false
    },
    {
      type: "tags",
      title: "Tags",
      is_active : false,
      tags : []
    },
    {
      type: "product_options",
      title: "Product Options",
      is_active : false.valueOf,
      tags : []
    }
  ]

  addSection(filter) {
    this.snackbar.open("Filter added.", "", {duration: 1000});
    this.dialogRef.close(filter);
  }

  ngOnInit(): void {
  }
}

