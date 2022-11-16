import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { BlogsService } from '../blogs.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = true;
  URLS = URLS;
  blogsPages = [];
  categoryList = [];


  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true
    },
    {
      title: "",
      selector: "updated_at",
      pipe: 'date',
      dateFormat: 'MMM d, h:mm a',
      width: "140px"
    }
  ];


  rowActions: string[] = ["Delete"];


  onCellClick(data) {
    this.router.navigate(["/", URLS.blogs, URLS.edit, data.row.id]);
  }


// For Category Table
  displayedCategoryColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true
    }
  ];


  rowCategoryActions: string[] = ["Delete"];


  onCellCategoryClick(data) {
    this.router.navigate(["/", URLS.blogs, URLS.editCategory, data.row.id]);
  }


  getBlogPages() {
    this.loading = true;
    this.blogsService.getBlogPages().then(resp => {
      this.loading = false;
      if (resp) {
        this.blogsPages = resp.data.results;
      }
    })
  }

  getCategories() {
    this.loading = true;
    this.blogsService.getCategories().then(resp => {
      this.loading = false;
      if (resp) {
        this.categoryList = resp.data.results;
      }
    })
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(BlogPageDeleteDialog, {
      width: "600px",
      data: {
        page: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getBlogPages();
      }
    });
  }


  onRowCategoryAction(data) {
    let dialogRef = this.dialog.open(CategoryDeleteDialog, {
      width: "600px",
      data: {
        category: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getCategories();
      }
    });
  }


  ngOnInit(): void {
    this.getBlogPages();
    this.getCategories();
  }
}



@Component({
  selector: 'blogpage-delete-dialog',
  templateUrl: '../dialogs/blogpage-delete-dialog.html',
})
export class BlogPageDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<BlogPageDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private blogsService: BlogsService,
  ) { }

  loading: boolean = false;

  deleteBlogPage() {
    this.loading = true;
    this.blogsService.deleteBlogPage(this.data.page.id).then(resp => {
      if (resp) {
        this.snackbar.open("Blog Page deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}



@Component({
  selector: 'category-delete-dialog',
  templateUrl: '../dialogs/category-delete-dialog.html',
})
export class CategoryDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<CategoryDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private blogsService: BlogsService,
  ) { }

  loading: boolean = false;

  deleteCategory() {
    this.loading = true;
    this.blogsService.deleteCategory(this.data.category.id).then(resp => {
      if (resp) {
        this.snackbar.open("Category deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}
