import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../../configuration/user-management/users.service';

@Component({
  selector: 'app-customization-header',
  templateUrl: './customization-header.component.html',
  styleUrls: ['./customization-header.component.scss']
})
export class CustomizationHeaderComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private usersService: UsersService, private snackbarService: MatSnackBar) { }



  loading:boolean = false;
  megaMenuImage:string = '';
  logoImage:string = '';

  customizationHeaderForm = this.fb.group({
    announcement_bar: this.fb.group({
      enable: [false],
      phone_number: [''],
      announcement_text: [''],
      show_language: [false],
      background_color: ['']
    }),

    header: this.fb.group({
      logo_image: [''],
      show_vender_signup: [false]
    }),
    navigation_bar: this.fb.group({
      show_category_structure: [false],
      category_structure: [[]],
      mega_menu_image: [''],
      mega_menu_image_link: [''],
      navigation: [null],
      show_track_order: [false]
    })

  });


  
  onSubmit(){
    this.loading = true;
  }

  goBack() {
    this.router.navigate([URLS.home]);
  }

  fetchMegamenuink(data){
    this.megaMenuImage = data;
    let navigationbar = (this.customizationHeaderForm.get("navigation_bar") as FormGroup)
    navigationbar.patchValue({
      mega_menu_image: this.megaMenuImage
    })
  }

  fetchlogolink(data){
    this.logoImage = data;
    let logo = (this.customizationHeaderForm.get("header") as FormGroup)
    logo.patchValue({
      logo_image: this.logoImage
    })
  }

  ngOnInit(): void {
  }

}
