import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { BrandsService } from '../brands.service';


@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private brandsService: BrandsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.brandID = this.route.snapshot.paramMap.get('id');
  }

  brandID = null;
  loading: boolean = true;
  URLS = URLS;
  brandForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    image: [null, [Validators.required]]
  });
  file_uploading: boolean = false;
  previewImageSrc: string = "";

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.file_uploading = false;
      if(resp) {
        this.previewImageSrc = resp.data[0].cdn_link;
        this.brandForm.patchValue({
          image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.brandForm.patchValue({
      image: null
    });
  }

  getBrandDetail() {
    this.loading = true;
    this.brandsService.getBrandDetail(this.brandID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        let data = {
          id: resp.data.id,
          name: resp.data.name,
          image: resp.data.image ? resp.data.image.id : null
        }
        this.brandForm.patchValue(data);
        this.previewImageSrc = resp.data.image ? resp.data.image.cdn_link : "";
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.brandsService.updateBrand(this.brandForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Brand updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.brands]);
      }
    });
  }

  ngOnInit(): void {
    this.getBrandDetail();
  }

} 
