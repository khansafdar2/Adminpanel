import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router ,ActivatedRoute} from '@angular/router';
import { BlogsService } from '../../../blogs/blogs.service';
import URLS from 'src/app/shared/urls';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { this.categoryId = this.route.snapshot.paramMap.get('id');}

  loading: boolean = false;
  URLS = URLS;
  categoryId

  categoryForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
  });


  getCategoryDetails() {
    this.loading = true;
    this.blogsService.getCategory(this.categoryId).then(resp => {
      this.loading = false;
      if (resp) {
        this.categoryForm.patchValue(resp.data);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.blogsService.updateCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Category updated.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.blogs]);
      }
    });
  }

  ngOnInit(): void {
    this.getCategoryDetails();
  }

}
