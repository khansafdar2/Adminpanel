import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { BlogsService } from '../../blogs.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { this.pageID = this.route.snapshot.paramMap.get('id'); }

  loading: boolean = true;
  imageUrl: string = '';
  URLS = URLS;
  previewImageSrc = ''
  categroyList:any;
  pageID: string = "";
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };

  blogPageForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    content: ["", [Validators.required]],
    author: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    blog_category:[null,[Validators.required]],
    is_active:[true],
    thumbnail_image:[''],
    status:['']
  });

  onImageChange(url){
    this.previewImageSrc = "";
    this.imageUrl = url;
    this.blogPageForm.patchValue({
      thumbnail_image: this.imageUrl
    })
  }

  getBlogPageDetails() {
    this.loading = true;
    this.blogsService.getBlogPage(this.pageID).then(resp => {
      this.loading = false;
      if (resp) {
        this.previewImageSrc = resp.data.thumbnail_image
        this.blogPageForm.patchValue(resp.data);
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.blogPageForm.patchValue({
      thumbnail_image: null
    });
  }

  getCategories() {
    this.blogsService.getCategoriesBlog().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.categroyList = resp.data.results;
      }
    })
  }

  onSubmit() {
    this.loading = true;
    this.blogsService.updateBlogPage(this.blogPageForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Blog Page updated.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.blogs]);
      }
    });
  }

  ngOnInit(): void {
    this.getBlogPageDetails();
    this.getCategories();
  }

}
