import { CustomizationService } from './../customization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from '../../configuration/user-management/users.service';

@Component({
  selector: 'app-footer-customization',
  templateUrl: './footer-customization.component.html',
  styleUrls: ['./footer-customization.component.scss']
})
export class FooterCustomizationComponent implements OnInit {

  constructor(private router: Router,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private customizationService: CustomizationService
  ) { }


  loading: boolean = false;
  logoImage: any;
  navigationslist = [];
  footerDetails: any;

  footerCustomizationForm = this.fb.group({
    background_color: [''],
    text_color: [''],
    footer_logo: [''],
    contact_information: [''],
    show_news_letter: [false],
    navigations: this.fb.array([])
  });

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };

  onLogoImageChange(url) {
    this.logoImage = url;
    let logo = this.footerCustomizationForm.get("footer_logo");
    logo.patchValue({
      logo_image: this.logoImage
    })
  }

  addNavigation() {
    (this.footerCustomizationForm.get("navigations") as FormArray).push(
      this.fb.group({
        id: [null],
        menu: [[]]
      })
    )
  }

  removeNavigation(index) {
    (this.footerCustomizationForm.get('navigations') as FormArray).removeAt(index);
  }

  fetchNavigations() {
    this.customizationService.getNavigations().then((response) => {
      if (response) {
        this.navigationslist = response.data;
      }
    });
  }

  fetchFooter() {
    this.customizationService.getFooter().then((resp) => {
      this.loading = false;
      if (resp) {
        this.footerDetails = resp.data.footer;
        this.logoImage = this.footerDetails.footer_logo.logo_image;
        for (let i = 0; i < this.footerDetails.navigations.length; i++) {
          (this.footerCustomizationForm.get('navigations') as FormArray).push(
            this.fb.group({
              id: [null],
              menu: [[]]
            })
          )
        }
        this.footerCustomizationForm.patchValue(this.footerDetails);
      } else {
        this.footerDetails = '';
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.customizationService.updateFooter({ footer: this.footerCustomizationForm.value })
      .then(resp => {
        this.loading = false;
        this.snackbarService.open('Footer updated.', "", { duration: 3000 });
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.snackbarService.open('An error occured while updating footer.', "", { duration: 3000 });
      });
  }

  ngOnInit(): void {
    this.fetchNavigations();
    this.fetchFooter();
  }

}
