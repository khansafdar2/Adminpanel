import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorySelectorDialogComponent } from 'src/app/shared/category-selector-dialog/category-selector-dialog.component';
import { BrandsService } from '../../products/brands/brands.service';


@Component({
  selector: 'homepage-slider-section',
  templateUrl: './templates/homepage-slider-section.html'
})
export class HomepageSliderSection implements OnInit {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  @Input() data:any = {
    slides: []
  };

  slideSortChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.slides, event.previousIndex, event.currentIndex);
  }

  addSlide() {
    this.data.slides.push({
      desktop_img: "",
      mobile_img: "",
      link: ""
    });
  }

  removeSlide(index) {
    this.data.slides.splice(index, 1);
    this.snackbar.open("Slide removed.", "", {duration: 1000});
  }

  ngOnInit(): void {
  }
}



@Component({
  selector: 'homepage-categories-carousel',
  templateUrl: './templates/homepage-categories-carousel.html'
})
export class HomepageCategoriesCarousel implements OnInit {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  @Input() data:any = {
    title: "",
    categories: []
  };

  sortChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.categories, event.previousIndex, event.currentIndex);
  }

  addCategory() {
    this.data.categories.push({
      handle: "",
      name: "",
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
    });
  }

  removeCategory(index) {
    this.data.categories.splice(index, 1);
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}



@Component({
  selector: 'homepage-brands',
  templateUrl: './templates/homepage-brands.html'
})
export class HomepageBrands implements OnInit {
  constructor(
    private brandsService: BrandsService
  ) { }

  
  @Input() data:any = {
    title: "",
    brands: []
  };
  
  loading: boolean = true;
  brands = [];

  getBrands() {
    this.loading = true;
    this.brandsService.getBrandsList(1, 1000, "").then(resp => {
      this.loading = false;
      if(resp) {
        this.brands = resp.data.results;
      }
    })
  }

  addBrand() {
    this.data.brands.push({
      brand_logo: "",
      brand_handle: ""
    });
  }

  sortChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.brands, event.previousIndex, event.currentIndex);
  }

  removeBrand(index) {
    this.data.brands.splice(index, 1);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getBrands();
  }
}



@Component({
  selector: 'homepage-products-carousel',
  templateUrl: './templates/homepage-products-carousel.html'
})
export class HomepageProductsCarousel implements OnInit {

  constructor() { }

  @Input() data:any = {
    title: "",
    category_handle: ''
  };

  ngOnInit() {
    console.log(this.data);
  }
}



@Component({
  selector: 'homepage-single-banner',
  templateUrl: './templates/homepage-single-banner.html'
})
export class HomepageSingleBanner implements OnInit {

  constructor() { }

  @Input() data:any = {
    desktop_img: "",
    mobile_img: "",
    link: ""
  };

  ngOnInit() {
    console.log(this.data);
  }
}



@Component({
  selector: 'homepage-categories-tabs',
  templateUrl: './templates/homepage-categories-tabs.html'
})
export class HomepageCategoriesTabs implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  @Input() data:any = {
    title: "",
    banner_img: "",
    categories: []
  };

  activeIndex = null;

  changeCategory(currentCategory, index) {
    this.activeIndex = index;
    let dialogRef = this.dialog.open(CategorySelectorDialogComponent, {
      width: "600px",
      data: {
        selected: currentCategory.handle,
        valueType: "object.handle"
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(value);
      this.data.categories[index].handle = value.handle;
      this.data.categories[index].title = value.name;
    });
  }

  sortChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.categories, event.previousIndex, event.currentIndex);
  }

  removeCategory(index) {
    this.data.categories.splice(index, 1);
  }

  addCategory() {
    this.data.categories.push({
      handle: '',
      name: '',
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
      ],
      title: ''
    });
  }

  ngOnInit() {
    console.log(this.data);
  }
}



@Component({
  selector: 'homepage-two-banners',
  templateUrl: './templates/homepage-two-banners.html'
})
export class HomepageTwoBanners implements OnInit {

  constructor() { }

  @Input() data:any = {
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
  };

  ngOnInit() {
    console.log(this.data);
  }
}



@Component({
  selector: 'homepage-feature-icons',
  templateUrl: './templates/homepage-feature-icons.html'
})
export class HomepageFeatureIcons implements OnInit {

  constructor() { }

  @Input() data:any = {
    features: []
  };

  sortChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.features, event.previousIndex, event.currentIndex);
  }

  removeFeature(index) {
    this.data.features.splice(index, 1);
  }

  addFeature() {
    this.data.features.push({
      icon_img: "",
      small_text: "",
      title: ""
    });
  }

  ngOnInit() {
    console.log(this.data);
  }
}
