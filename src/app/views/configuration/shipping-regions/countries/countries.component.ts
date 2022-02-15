import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
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
  ];
  country = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  region_name = ""
  region_id = null

  getCountryList() {
    this.loading = true;
    this.shippingRegionService.getCountryList(this.regionID, this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.country = resp.data.results;
        this.region_name = resp.data.results[0].region_name
        this.totalCount = resp.data.count;
      }
    });
  }

  
  getRegionDetail(){
    this.shippingRegionService.getShippingRegionDetail(this.regionID).then(resp=>{
      if (resp) {
        this.region_name = resp.data.name
      }
    })
  }
  
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCountryList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.cities, data.row.id]);
  }
  

  ngOnInit(): void {
    this.getRegionDetail();
    this.getCountryList();
  }

}
