import { ShippingRegionService } from './shipping-region.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-shipping-regions',
  templateUrl: './shipping-regions.component.html',
  styleUrls: ['./shipping-regions.component.scss']
})
export class ShippingRegionsComponent implements OnInit {

  constructor(
    private shippingRegionService: ShippingRegionService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Name",
      selector: "name",
      clickable: true
    },

    {
      title: "Status",
      selector: "is_active",
      cell: row => row.is_active === true ? "Active" : "Inactive"
    },
    {
      title: "Created at",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Updated at",
      selector: "updated_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    }
  ];
  rowActions = ["Edit", "Delete"]
  shippingRegion = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getShippingRegionList() {
    this.loading = true;
    this.shippingRegionService.getShippingRegionList().then(resp => {
      this.loading = false;
      if (resp) {
        this.shippingRegion = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getShippingRegionList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.country, data.row.id]);
  }



  onCreate() {
    let dialogRef = this.dialog.open(ShippingRegionCreateDialog, {
      width: "600px",
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getShippingRegionList();
      }
    });
  }

  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(ShippingRegionCreateDialog, {
        width: "600px",
        data: {
          region: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getShippingRegionList();
        }
      });
    }
    else if (data.action === "Delete") {
      let dialogRef = this.dialog.open(ShippingRegionDeleteDialog, {
        width: "600px",
        data: {
          region: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getShippingRegionList();
        }
      });
    }
  }


  ngOnInit(): void {
    this.getShippingRegionList();
  }

}


@Component({
  selector: 'shipping-region-delete-dialog',
  templateUrl: './dialogs/shipping-region-delete-dialog.html',
})
export class ShippingRegionDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ShippingRegionDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.shippingRegionService.deleteShippingRegion(this.data.region.id).then(resp => {
      if (resp) {
        this.snackBar.open("Region deleted.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }
}

@Component({
  selector: 'shipping-region-create-dialog',
  templateUrl: './dialogs/shipping-region-create.html',
})
export class ShippingRegionCreateDialog {
  constructor(
    public dialogRef: MatDialogRef<ShippingRegionCreateDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;

  regionForm = this.fb.group({
    name: ['']
  })

  onSave() {
    this.loading = true;
    let shippingRegionApiCall: any;
    if (this.data) {
      let mainObj = this.regionForm.value;
      mainObj.id = this.data.region.id;
      shippingRegionApiCall = this.shippingRegionService.updateShippingRegion(mainObj)
    } else {
      shippingRegionApiCall = this.shippingRegionService.createShippingRegion(this.regionForm.value)
    }
    shippingRegionApiCall.then(resp => {
      if (resp) {
        this.snackBar.open("Region saved.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.regionForm.patchValue(this.data.region)
    }
  }
}
