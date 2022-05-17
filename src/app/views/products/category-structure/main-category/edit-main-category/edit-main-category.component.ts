import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-edit-main-category',
  templateUrl: './edit-main-category.component.html',
  styleUrls: ['./edit-main-category.component.scss']
})
export class EditMainCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService) {
    this.categoryID = this.route.snapshot.paramMap.get('id');
  }

  URLS = URLS;
  loading: boolean = true;
  file_uploading: boolean = false;
  categoryID = null;
  bannerFile: File;
  metaFields = [
    {
      field: "",
      value: ""
    }
  ];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  previewImageSrc: string = "";
  categoryForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    description: [''],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    slug: [''],
    banner_image: [null],
    is_active: [false],
    meta_data: this.fb.array([])
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

  getCategoryDetail() {
    this.loading = true;
    this.categoryService.getMainCategoryDetail(this.categoryID).then(resp =>{
      this.loading = false;
      if(resp) {
        let data = resp.data;
        let banner_image = data.banner_image;
        if(data.meta_data.length) {
          for (let i = 0; i < data.meta_data.length; i++) {
            this.addMetaField()
          }
        }
        if(data.banner_image) {
          data.banner_image = banner_image.id;
          this.previewImageSrc = banner_image.cdn_link;
        }
        this.categoryForm.patchValue(data);
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.categoryForm.patchValue({
      banner_image: null
    });
  }

  onSubmit() {
    this.loading = true;
    this.categoryService.updateMainCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Category updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.categories]);
      }
    })
  }

  ngOnInit(): void {
    this.getCategoryDetail();
  }

}
