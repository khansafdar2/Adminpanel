import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { BlogsService } from '../blogs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';




@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  loading: boolean = true;
  URLS = URLS;
  blogsPages = [];
  categoryList = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;


  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title',
      clickable: true,  
      sortable: true,
    },
    {
      title: "Category",
      selector: 'blog_category_title',

    },
    {
      title: "Status",
      selector: 'status',
      cell: row => `<span class="label ${row.status == 'Publish' ? 'success' : ''}${row.status == 'Draft' ? 'Inactive' : ''}">${row.status}</span>`

    },
  ];


  // rowActions: string[] = ["Delete"];

  rowActions = row => {
    if(row.status =="Publish"){

      let actions = [];
      actions.push('Draft');
      actions.push('Delete');
      return actions;
    }
    else{
      
      let actions = [];
      actions.push('Publish');
      actions.push('Delete');
      return actions;
    }
  }

  statusChange(row){
    this.loading = true;
    this.blogsService.statusChange(row).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Status change successfully.", "", { duration: 3000 });
        this.getBlogPages();
      }
    })
  }


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

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getBlogPages();
  }

  sortData(event:PageEvent){

  }
  sortChanged(event){

  }



  getBlogPages() {
    this.loading = true;
    this.blogsService.getBlogPages(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if (resp) {
        this.blogsPages = resp.data.results;
        this.totalCount = resp.data.count;
      }
    })
  }

  
  pageSizeCategory: number = 10;
  pageNumberCategory: number = 1;
  totalCountCategory: number = 0;

  onPageCategory(event: PageEvent) {
    this.pageNumberCategory = event.pageIndex + 1;
    this.pageSizeCategory = event.pageSize;
    this.getBlogPages();
  }

  getCategories() {
    this.loading = true;
    this.blogsService.getCategories(this.pageNumberCategory,this.pageSize).then(resp => {
      this.loading = false;
      if (resp) {
        this.categoryList = resp.data.results;
        this.totalCountCategory = resp.data.count;

      }
    })
  }

  onRowAction(data) {
    if(data.action =="Delete"){
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
    else{
      this.statusChange(data.row)
    }
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
