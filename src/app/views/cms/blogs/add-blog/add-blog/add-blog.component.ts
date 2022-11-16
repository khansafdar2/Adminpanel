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
  URLS = URLS;
  categroyList:any = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };


  blogPageForm = this.fb.group({
    title: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    content: ["", [Validators.required]],
    author: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    blog_category:[null,[Validators.required]]
  });


  getCategories() {
    this.blogsService.getCategories().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.categroyList = resp.data.results;
      }
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
    });
  }


  ngOnInit(): void {
    this.getCategories();
  }
}