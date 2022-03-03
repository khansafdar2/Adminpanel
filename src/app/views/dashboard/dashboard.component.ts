import { VendorsService } from './../vendors/vendors.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/environments/environment';
import {Moment} from 'moment/moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private vendorService: VendorsService
  ) { 
  }

  loading: boolean = true;
  vendor = this.authService.user.is_vendor;
  vendors: any;
  storeCurrency = environment.currency;
  cardsStats = {
    total_orders: 0,
    total_sale: 0,
    today_orders: 0,
    today_sale: 0
  }

  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];

lineData =[

  {
    "name": "Germany",
    "series": [
      {
        "name": "1990",
        "value": 62000000
      },
      {
        "name": "2010",
        "value": 73000000
      },
      {
        "name": "2011",
        "value": 89400000
      }
    ]
  }
]

selected: {startDate: Moment, endDate: Moment};

  onVendorChange() {

  }

  getVendors() {
    this.vendorService.getVendorsList(1, 150).then(resp => {
      if (resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  testButton() {
    console.log(this.selected.endDate.locale())
  }

  getCardStats() {
    this.loading = true;
    this.dashboardService.getCardStats().then(resp => {
      this.loading = false;
      if(resp) {
        this.cardsStats = resp.data;
      }
    });
  }

  ngOnInit(): void {
    this.getCardStats();
    this.getVendors();
  }

}
