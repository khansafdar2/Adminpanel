import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { PagesService } from './pages.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(
    private pagesService: PagesService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = true;
  URLS = URLS;
  pages = [];
  displayedColumns: Column[] = [
    {
      title: "",
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
    this.router.navigate(["/", URLS.pages, URLS.edit, data.row.id]);
  }

  getPages() {
    this.loading = true;
    this.pagesService.getPages().then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.pages = resp.data;
      }
    })
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(PageDeleteDialog, {
      width: "600px",
      data: {
        page: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if(deleted) {
        this.getPages();
      }
    });
  }

  ngOnInit(): void {
    this.getPages();
  }

}




@Component({
  selector: 'page-delete-dialog',
  templateUrl: './dialogs/page-delete-dialog.html',
})
export class PageDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<PageDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private pagesService: PagesService,
    ) {
  }

  loading: boolean = false;

  deletePage() {
    this.loading = true;
    this.pagesService.deletePage(this.data.page.id).then(resp => {
      if(resp) {
        this.snackbar.open("Page deleted successfully.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}
