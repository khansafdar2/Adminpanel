import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from '../../configuration/user-management/users.service';
import { CustomizationService } from '../customization.service';

@Component({
  selector: 'app-customization-header',
  templateUrl: './customization-header.component.html',
  styleUrls: ['./customization-header.component.scss']
})
export class HeaderCustomizationComponent implements OnInit {

  constructor(private router: Router,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private customizationService: CustomizationService
    ) { }

  loading:boolean = false;
  megaMenuImage:string = '';
  logoImage:string = '';
  navigationslist = [];
  headerDetails:any;

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
      mega_menu_image_alt: [''],
      navigation: [null],
      show_track_order: [false]
    })
  });
 
  onSubmit(){
    this.loading = true;
    this.customizationService.updateHeader({header:this.customizationHeaderForm.value})
    .then(resp => {
      this.loading = false;
      this.snackbarService.open('Header updated.', "", { duration: 3000 });
    }).catch(error => {
      console.log(error);
    })
  }

  onMegaMenuImageChange(url){
    this.megaMenuImage = url;
    let navigationBar = (this.customizationHeaderForm.get("navigation_bar") as FormGroup)
    navigationBar.patchValue({
      mega_menu_image: this.megaMenuImage
    })
  }

  onLogoImageChange(url){
    this.logoImage = url;
    let headerFormGroup = (this.customizationHeaderForm.get("header") as FormGroup)
    headerFormGroup.patchValue({
      logo_image: this.logoImage
    })
  }

  fetchNavigations(){
    this.customizationService.getNavigations().then((response)=>{
      if (response) {
       this.navigationslist = response.data; 
      }
    })
  }

  fetchHeaderDetails(){
    this.loading = true;
    this.customizationService.getHeader().then((resp)=>{
    this.loading = false;
      if (resp) {
        this.headerDetails = resp.data.header;
        this.customizationHeaderForm.patchValue(this.headerDetails);
        this.megaMenuImage = this.headerDetails.navigation_bar.mega_menu_image;
        this.logoImage = this.headerDetails.header.logo_image;
      } else {
        this.headerDetails = '';
      }
    })
  }

  ngOnInit(): void {
    this.fetchNavigations();
    this.fetchHeaderDetails();
  }
}
