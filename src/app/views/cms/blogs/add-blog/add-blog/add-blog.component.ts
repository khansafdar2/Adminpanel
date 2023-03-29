import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { BlogsService } from '../../blogs.service';


@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }


  loading: boolean = false;
  selectedOption = "Draft"
  imageUrl: string = '';
  URLS = URLS;
  categroyList: any = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike','link', 'image', 'video'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };


  blogPageForm = this.fb.group({
    title: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    content: ["", [Validators.required]],
    author: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    blog_category: [null,[Validators.required]],
    is_active: [true],
    thumbnail_image: [''],
    status: ['']
  });


  getCategories() {
    this.blogsService.getCategoriesBlog().then(resp => {
      if (resp) {
        console.log(resp.data);
        this.categroyList = resp.data.results;
      }
    })
  }


  onImageChange(url) {
    this.imageUrl = url;
    this.blogPageForm.patchValue({
      thumbnail_image: this.imageUrl
    })
  }


  onSubmit() {
    this.loading = true;
    this.blogsService.createBlogPage(this.blogPageForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Blog Page created.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.blogs]);
      }
    })
  }


  ngOnInit(): void {
    this.getCategories();
  }
}