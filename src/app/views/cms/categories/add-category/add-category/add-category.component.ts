import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BlogsService } from '../../../blogs/blogs.service';
import URLS from 'src/app/shared/urls';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;

  categoryForm = this.fb.group({
    title: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
  });


  onSubmit() {
    this.loading = true;
    this.blogsService.createCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Category created.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.blogs]);
      }
    });
  }

  ngOnInit(): void {
  }

}
