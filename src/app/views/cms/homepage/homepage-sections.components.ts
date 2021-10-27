import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'homepage-slider-section',
  templateUrl: './templates/homepage-slider-section.html',
  styles: [`
    .slide-sort-handle {
      cursor: grab;
    }
  `]
})
export class HomepageSliderSection implements OnInit {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  @Input()data:any = {
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
  templateUrl: './templates/homepage-categories-carousel.html',
  styles: [``]
})
export class HomepageCategoriesCarousel implements OnInit {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  @Input()data:any = {
    title: "",
    categories: []
  };

  ngOnInit(): void {
    console.log(this.data);
  }
}
