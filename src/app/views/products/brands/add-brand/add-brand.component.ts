import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { BrandsService } from '../brands.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private brandsService: BrandsService,
    private snackbarService: MatSnackBar,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS; 
  brandForm = this.fb.group({
    name: ['', [Validators.required]],
    image: [null, [Validators.required]],
    banner_image: [null]
  });
  logo_uploading: boolean = false;
  banner_uploading: boolean = false;
  previewLogoImageSrc: string = "";
  previewBannerImageSrc: string = "";

  logoImageSelect(e) {
    const file = e.target.files[0];
    this.logo_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.logo_uploading = false;
      if(resp) {
        this.previewLogoImageSrc = resp.data[0].cdn_link;
        this.brandForm.patchValue({
          image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.banner_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.banner_uploading = false;
      if(resp) {
        this.previewBannerImageSrc = resp.data[0].cdn_link;
        this.brandForm.patchValue({
          banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeLogo() {
    this.previewLogoImageSrc = "";
    this.brandForm.patchValue({
      image: null
    });
  }

  removeBanner() {
    this.previewBannerImageSrc = "";
    this.brandForm.patchValue({
      image: null
    });
  }

  onSubmit() {
    this.loading = true;
    this.brandsService.createBrand(this.brandForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Brand created successfully.", "", {duration: 3000});
        this.router.navigate(["/", URLS.brands]);
      }
    });
  }

  ngOnInit(): void {
  }

}
