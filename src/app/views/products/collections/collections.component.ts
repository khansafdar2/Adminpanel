import { AuthService } from 'src/app/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { CollectionsService } from './collections.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { VendorsService } from '../../vendors/vendors.service';
import { filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  constructor(
    private collectionsService: CollectionsService,
    private router: Router,
    private vendorsService: VendorsService,
    private authservice:AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar) { }

  URLS = URLS;
  loading: boolean = true;
  collections = [];
  vendors = [];
  is_vendor = this.authservice.user.is_vendor;
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    {
      title: "",
      selector: "product_count",
      cell: row =>  row.product_count + ' products'
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
    {
      title: "Approval",
      selector: "status",
      cell: row => `<span class="label ${row.status == 'Approved' ? 'success' : ''}${row.status == 'Disapproved' ? 'warning' : ''}">${row.status}</span>`

    }
  ]
  collectionSelection: SelectionModel<[]> = new SelectionModel(true, []);
  searchColumns = [
    {
      label: "Title",
      value: "title"
    }
  ];
  filtersArray = [
    {
      title: "Status",
      key: "status",
      values: [
        {
          label: "Active",
          value: "active"
        },
        {
          label: "Inactive",
          value: "inactive"
        }
      ]
    },
    {
      title: "Approval status",
      key: "approval_status",
      values: [
        {
          label: "Approved",
          value: "approved"
        },
        {
          label: "Disapproved",
          value: "disapproved"
        }
      ]
    }
  ]
  filterString: string = "";
  searchString: string = "";
  pageNumber: number = 1;
  pageSize: number = 50;


  public rowActions = (row) => {
    let actions = [];
    row.is_active ? actions.push("Deactivate") : actions.push("Activate");
    actions.push("Delete");
    return actions;
  }

  onCellClick(data) {
    if(data.column == "title") {
      this.router.navigate(["/", URLS.collections, URLS.edit, data.row.id]);
    }
  }

  getCollections() {
    this.loading = true;
    this.collectionSelection.clear();
    this.collectionsService.getCollectionsList(this.pageNumber, this.pageSize, this.filterString, this.searchString).then(resp => {
      this.loading = false;
      if(resp) {
        this.collections = resp.data.results;
      }
    });
  }

  getVendorsList() {
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      if(resp) {
        if (!this.is_vendor) {
          this.vendors = resp.data.results;
          let tempVendors = [];
          tempVendors = this.vendors.map(vendor => {
            return {
              label: vendor.name,
              value: vendor.id
            }
          });
          this.filtersArray[0].values = tempVendors;
        }
      }
    })
  }

  showVendorColumnAndFilter(){
    if (!this.is_vendor) {
      this.displayedColumns.push({
        title: "Vendor",
        selector: "vendor_name"
      });
      this.filtersArray.unshift({
        title: "Vendor",
        key: 'vendor',
        values: []
      });
    }
  }

  onFilter(filters) {
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if(filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getCollections();
  }

  onSearch(data) {
    let tempSearchString = "";
    if(data.query) {
      tempSearchString += "&search=" + data.query + "&column=" + data.column;
    }
    this.searchString = tempSearchString;
    this.getCollections();
  }

  onRowAction(data) {
    if(data.action === "Delete") {
      let dialogRef = this.dialog.open(CollectionDeleteDialog, {
        width: "600px",
        data: {
          collections: [data.row]
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.snackbar.open("Collection deleted successfuly.", "", {duration: 3000});
          this.getCollections();
        }
      })
    } else if(data.action === "Activate" || data.action === "Deactivate") {
      this.changeCollectionStatus(data.row.id, "active", data.action === "Activate");
    } else if(data.action === "Approve" || data.action === "Disapprove") {
      this.changeCollectionStatus(data.row.id, "approved", data.action === "Approve");
    }
  }

  bulkChangeStatus() {
    let dialogRef = this.dialog.open(CollectionsChangeStatusDialog, {
      width: "600px",
      data: {
        collections: this.collectionSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if(updated) {
        this.getCollections();
      }
    });
  }

  bulkChangeApprovalStatus() {
    let dialogRef = this.dialog.open(CollectionsChangeApprovalStatusDialog, {
      width: "600px",
      data: {
        collections: this.collectionSelection.selected
      }
    });
  
    dialogRef.afterClosed().subscribe(updated => {
      if(updated) {
        this.getCollections();
      }
    });
  }

  bulkDeleteCollections() {
    let dialogRef = this.dialog.open(CollectionDeleteDialog, {
      width: "600px",
      data: {
        collections: this.collectionSelection.selected
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if(deleted) {
        this.getCollections();
      }
    });
  }

  changeCollectionStatus(id, status: string, value: boolean) {
    this.loading = true;
    this.collectionsService.change_status([id], status, value).then(resp => {
      if(resp) {
        this.snackbar.open("Collection status updated.", "", {duration: 3000});
        this.getCollections();
      }
    })
  }

  ngOnInit(): void {
    this.getCollections();
    if(!this.is_vendor) {
      this.getVendorsList();
    }
    this.showVendorColumnAndFilter();
  }
}


@Component({
  selector: 'collection-change-status-dialog',
  templateUrl: './dialogs/collection-change-status-dialog.html',
})
export class CollectionsChangeStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<CollectionsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private collectionService: CollectionsService,
    private snackbar: MatSnackBar) {}

  loading: boolean = false;
  status: string;

  onUpdate() {
    let 
      ids = this.data.collections.map(collection => collection.id),
      status = "active",
      value = this.status == "1";
    this.loading = true;
    this.collectionService.change_status(ids, status, value).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackbar.open("Collections status has been updated.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}


@Component({
  selector: 'collection-change-approval-status-dialog',
  templateUrl: './dialogs/collection-change-approval-status-dialog.html',
})
export class CollectionsChangeApprovalStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<CollectionsChangeApprovalStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private collectionService: CollectionsService,
    private snackbar: MatSnackBar) {}

  loading: boolean = false;
  status: string;

  onUpdate() {
    let 
      ids = this.data.collections.map(collection => collection.id),
      status = "approved",
      value = this.status == "1";
    this.loading = true;
    this.collectionService.change_status(ids, status, value).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackbar.open("Collections approval status has been updated.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}


@Component({
  selector: 'collection-delete-dialog',
  templateUrl: './dialogs/collection-delete-dialog.html',
})
export class CollectionDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<CollectionDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private collectionsService: CollectionsService) {

    this.count = data.collections.length;
    let idsArray = [];
    idsArray = this.data.collections.map(collection => collection.id);
    this.ids = idsArray.join(",");
  }

  loading: boolean = false;
  count: number = 0;
  ids = "";

  deleteCollections() {
    this.loading = true;
    this.collectionsService.deleteCollection(this.ids).then(resp => {
      if(resp) {
        this.dialogRef.close(true);
      }
    });
  }
}
