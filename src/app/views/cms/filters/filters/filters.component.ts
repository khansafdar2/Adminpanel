import URLS from 'src/app/shared/urls';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FiltersService } from '../filters.service';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(
    private filtersService: FiltersService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  URLS = URLS;

  loading: boolean = false;
  filters = []
  allowedFilters = [];
  activeSection = null;
  activeSectionIndex = null;

  setActiveSection(section, index) {
    this.activeSection = section;
    this.activeSectionIndex = index;
  }

  sortChanged(event: CdkDragDrop<string[]>) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    moveItemInArray(this.filters, event.previousIndex, event.currentIndex);
  }

  removeSection(index) {
    this.activeSection = null;
    this.activeSectionIndex = null;
    this.filters.splice(index, 1);
  }

  onAddSectionClick() {
    let dialogRef = this.dialog.open(AddFilterDialog, {
      width: "600px",
      data: {
        allowedFilters: this.allowedFilters
      }
    });

    dialogRef.afterClosed().subscribe(section => {
      if(section) {
        this.filters.push(section);
      }
    });
  }

  getFilters()
  {
    this.loading = true;
    this.filtersService.getFilters().then(resp => {
      this.loading = false;
      if(resp) {
        
        for(let filter of resp.data)
        {
          if(filter.tags)
          {
            filter.tags = filter.tags.split(",")
          }
        }
        this.filters = resp.data
      }
    });
  }

  onPublish() {
    this.loading = true;
    for (let i = 0; i < this.filters.length; i++) {
      const filter = this.filters[i];
      if(filter.tags)
      {
        filter.tags = filter.tags.toString()
      }
      filter.position = i;
    }
    this.filtersService.createFilters(this.filters).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Filters updated.", "", {duration: 2000});
      }
    });
  }

  ngOnInit(): void {
    this.getFilters();
  }


}

@Component({
  selector: 'add-filter-dialog',
  templateUrl: './dialogs/add-filter-dialog.html'
})
export class AddFilterDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddFilterDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar
  ) { }

  filterTypes = [
    {
      type: "price",
      title: "Price",
      is_active : false
    },
    {
      type: "collection",
      title: "Collection",
      is_active : false
    },
    {
      type: "brand",
      title: "Brand",
      is_active : false
    },
    {
      type: "tags",
      title: "Tags",
      is_active : false,
      tags : []
    },
    {
      type: "product_options",
      title: "Product Options",
      is_active : false.valueOf,
      tags : []
    }
  ]

  addSection(filter) {
    this.snackbar.open("Filter added.", "", {duration: 1000});
    this.dialogRef.close(filter);
  }

  ngOnInit(): void {
  }
}

