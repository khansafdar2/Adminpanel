import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ShippingRegionService } from '../../shipping-region.service';


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {


  constructor(
    private shippingRegionService: ShippingRegionService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.country_id = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : null
   }

  loading: boolean = false;
  URLS = URLS;
  country_id:any;
  columns: Column[] = [
    {
      title: "Name",
      selector: "name",
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
  rowActions = ["Delete", "Edit"]
  city = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  getCityList() {
    this.loading = true;
    this.shippingRegionService.getCityList(this.country_id).then(resp => {
      this.loading = false;
      if(resp) {
        this.city = resp.data;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCityList();
  }


  onRowAction(data) {
    if(data.action === "Delete") {
      let dialogRef = this.dialog.open(CityDeleteDialog, {
        width: "600px",
        data: {
          city: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getCityList();
        }
      });
    }
  }


  ngOnInit(): void {
    this.getCityList();
  }

}


@Component({
  selector: 'city-delete-dialog',
  templateUrl: '../../dialogs/city-delete-dialog.html',
})
export class CityDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<CityDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.shippingRegionService.deleteCity(this.data.city.id).then(resp => {
      if(resp) {
        this.snackBar.open("City deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}
