import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-new-sub-category',
  templateUrl: './new-sub-category.component.html',
  styleUrls: ['./new-sub-category.component.scss']
})
export class NewSubCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute) {

    this.mainCategoryID = this.route.snapshot.paramMap.get('mainID');
  }

  mainCategoryID = null;
  URLS = URLS;
  loading: boolean = false;
  file_uploading: boolean = false;
  thumbnail_uploading: boolean = false;
  bannerFile: File;
  thumbnailFile: File;
  vendors = [];
  previewImageSrc: string = "";
  previewThumbnailSrc: string = "";
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  categoryForm = this.fb.group({
    main_category: [null],
    name: ['', [Validators.required]],
    description: [''],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    slug: [''],
    banner_image: [null],
    thumbnail_image: [null],
    is_active: [false],
    meta_data: this.fb.array([
      this.fb.group({
        field: [''],
        value: ['']
      })
    ])
  });

  addMetaField() {
    (this.categoryForm.get('meta_data') as FormArray).push(
      this.fb.group({
        field: [''],
        value: ['']
      })
    )
  }

  deleteMetaField(index) {
    (this.categoryForm.get('meta_data') as FormArray).removeAt(index);
  }

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.file_uploading = false;
      if(resp) {
        this.previewImageSrc = resp.data[0].cdn_link;
        this.categoryForm.patchValue({
          banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  thumbnailImageSelect(e) {
    const file = e.target.files[0];
    this.thumbnail_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.thumbnail_uploading = false;
      if(resp) {
        this.previewThumbnailSrc = resp.data[0].cdn_link;
        this.categoryForm.patchValue({
          thumbnail_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.categoryForm.patchValue({
      banner_image: null
    });
  }

  removeThumbnail() {
    this.previewThumbnailSrc = "";
    this.categoryForm.patchValue({
      thumbnail_image: null
    });
  }

  onSubmit() {
    this.loading = true;
    this.categoryService.createSubCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('Category created.', "", {duration: 3000});
        this.router.navigate(['/', URLS.categories]);
      }
    })
  }

  ngOnInit(): void {
    this.categoryForm.patchValue({
      main_category: this.mainCategoryID
    })
  }

}
