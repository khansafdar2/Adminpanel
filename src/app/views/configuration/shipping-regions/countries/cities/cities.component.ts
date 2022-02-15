import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  ];
  rowActions = ["Edit", "Delete"]
  city = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  country_name = '';
  countryID = null

  getCityList() {
    this.loading = true;
    this.shippingRegionService.getCityList(this.country_id).then(resp => {
      this.loading = false;
      if(resp) {
        this.city = resp.data.results;
        this.country_name = resp.data.results[0].country_name;
        this.totalCount = resp.data.count;
      }
    });
  }

  getCountryDetail(){
    this.loading = true;
    this.shippingRegionService.getCountryDetail(this.country_id).then(resp=>{
      this.loading = false;
      if (resp) {
        this.country_name = resp.data.name;
        this.countryID = resp.data.region;
      }
    })
  }


  navigateToCountry() {
    this.router.navigate(["/", URLS.country, this.countryID]);
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCityList();
  }

  onCreate() {
    let dialogRef = this.dialog.open(CreateCityDialog, {
      width: "600px",
      data: {
        country_id: this.country_id
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getCityList();
      }
    });
  }

  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(CreateCityDialog, {
        width: "600px",
        data: {
          city: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getCityList();
        }
      });
    }
   else if(data.action === "Delete") {
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
    this.getCountryDetail();
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
  city_name = this.data.city.name
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


@Component({
  selector: 'create-city-dialog',
  templateUrl: '../../dialogs/create-city.html',
})
export class CreateCityDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateCityDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingRegionService: ShippingRegionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;

  cityForm = this.fb.group({
    name: ['']
  })

  onSave() {
    this.loading = true;
    let cityApiCall: any;
    if (this.data.country_id) {
      let mainObj = this.cityForm.value;
      mainObj.country_id = this.data.country_id;
      cityApiCall = this.shippingRegionService.createCity(mainObj)
    } else {
      let mainObj = this.cityForm.value;
      mainObj.id = this.data.city.id;
      mainObj.country_id = this.data.city.country;
      cityApiCall = this.shippingRegionService.updateCity(mainObj)
    }
    cityApiCall.then(resp => {
      if (resp) {
        this.snackBar.open("City saved.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.cityForm.patchValue(this.data.city)
    }
  }
}