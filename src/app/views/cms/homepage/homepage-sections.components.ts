import { Component, Inject, Input, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'homepage-slider-section',
  templateUrl: './templates/homepage-slider-section.html',
})
export class HomepageSliderSection implements OnInit {
  constructor() { }

  @Input()data:any = {
    slides: []
  };

  ngOnInit(): void {
    console.log(this.data);
  }
}
