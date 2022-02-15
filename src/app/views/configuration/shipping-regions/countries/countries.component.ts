import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ShippingRegionService } from '../shipping-region.service';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {


  constructor(
    private shippingRegionService: ShippingRegionService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.regionID = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : null
   }

  loading: boolean = false;
  URLS = URLS;
  regionID:any;
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
  country = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  region_name = ""
  region_id = null

  getCountryList() {
    this.loading = true;
    this.shippingRegionService.getCountryList(this.regionID).then(resp => {
      this.loading = false;
      if(resp) {
        this.country = resp.data.results;
        this.region_name = resp.data.results[0].region_name
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCountryList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.cities, data.row.id]);
  }
  

  onCreate() {
    let dialogRef = this.dialog.open(CreateCountryDialog, {
      width: "600px",
      data: {
        region_id: this.regionID
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getCountryList();
      }
    });
  }
  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(CreateCountryDialog, {
        width: "600px",
        data: {
          country: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getCountryList();
        }
      });
    }
   else if(data.action === "Delete") {
      let dialogRef = this.dialog.open(CountryDeleteDialog, {
        width: "600px",
        data: {
          country: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getCountryList();
        }
      });
    }
  }


  ngOnInit(): void {
    this.getCountryList();
  }

}


@Component({
  selector: 'country-delete-dialog',
  templateUrl: '../dialogs/country-delete-dialog.html',
})
export class CountryDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<CountryDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.shippingRegionService.deleteCountry(this.data.country.id).then(resp => {
      if(resp) {
        this.snackBar.open("Country deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'create-country-dialog',
  templateUrl: '../dialogs/create-country.html',
})
export class CreateCountryDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateCountryDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;

  countryForm = this.fb.group({
    name: ['']
  })

  onSave() {
    this.loading = true;
    let countryApiCall: any;
    if (this.data.region_id) {
      let mainObj = this.countryForm.value;
      mainObj.region_id = this.data.region_id;
      countryApiCall = this.shippingRegionService.createCountry(mainObj)
    } else {
      let mainObj = this.countryForm.value;
      mainObj.id = this.data.country.id;
      mainObj.region_id = this.data.country.region;      
      countryApiCall = this.shippingRegionService.updateCountry(mainObj)
    }
    countryApiCall.then(resp => {
      if (resp) {
        this.snackBar.open("Country saved.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.countryForm.patchValue(this.data.country)
    }
  }
}
