// import { Component, OnInit } from '@angular/core';
import { Component, Inject, ViewEncapsulation, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { debounce } from "@agentepsilon/decko";
import { NavigationService } from './navigation.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-navigations',
  templateUrl: './navigations.component.html',
  styleUrls: ['./navigations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationsComponent implements OnInit {
  // ids for connected drop lists
  allNavigations: any
  loading: boolean = false;
  URLS = URLS
  
  constructor(@Inject(DOCUMENT) 
  private document: Document,
  private navigationService: NavigationService,
  private router: Router,
  public dialog: MatDialog,
  private snackbarService: MatSnackBar
  ) {
    
  }
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true,
      width: "35%"
    }
  ]
  ngOnInit(): void {
    
    this.fetchNavigations()
  }
  fetchNavigations() {
    this.navigationService.getNavigations().then((resp) => {
      this.allNavigations = resp
      console.log('all navigations', this.allNavigations.data)
    })
  }
  onCellClick(data) {
    
    if(data.column === "title") {
      this.router.navigate(["/", URLS.navigations, URLS.edit, data.row.id]);
    }
  }
  rowActions = row => {
    let actions = [];
    // actions.push(row.is_active ? "Deactivate" : "Activate");
    actions.push("Delete");
    return actions;
  }

  onRowAction(data) {
    if(data.action === "Delete") {
      debugger
      let dialogRef = this.dialog.open(NavigationDeleteDialog, {
        width: "600px",
        data: {
          navId: data.row.id
        }
      });
  
      dialogRef.afterClosed().subscribe(applied => {
        if(applied) {
          this.snackbarService.open("Navigation Deleted Successfully ", "", {duration: 3000});
          this.fetchNavigations()
        }
      });
    }
  }
}

@Component({
  selector: 'delete-navigation-dialog',
  templateUrl: './dialogs/delete-navigation-dialog.html',
})
export class NavigationDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<NavigationDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private navigationService: NavigationService) {
}

  loading: boolean = false;
  
  deleteNavigation() {
    debugger
    this.loading = true;
    this.navigationService.deleteSingleNavigation(this.data.navId).then(resp => {
      if(resp) {
        this.dialogRef.close(true);
      }
    });
  }
}



