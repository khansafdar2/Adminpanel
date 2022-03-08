import { VendorsService } from './../vendors/vendors.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/environments/environment';
import {Moment} from 'moment/moment';
import * as moment from 'moment/moment';

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
  is_vendor = this.authService.user.is_vendor;
  vendors: any;
  vendorID:any;
  storeCurrency = environment.currency;
  inventorySize:number;
  netSale:number;
  totalSale:number;
  average_basket_size:number;
  average_basket_value:number;
  canceled_orders_count:number;
  returned_orders_count:number;

  commission_value = null;
  vendor_name = "";
  paid_value = null;
  pending_value = null;
  total_vendor_orders = null
  total_value = null;
  total_orders:number;
  total_active_products_count:number;
  total_collections_count:number;
  total_inactive_products_count:number;
  total_product_group_count:number;
  total_products_count:number;
  total_vendor_count:number;
  start_date: any;
  end_date:any;
  showTotalVendor: boolean = true;
  defaultSelected = '';
  topSolditems:any;
  soldItemLengthCheck: boolean = false;
  saleByCity:any;
  saleByCityLengthCheck: boolean = false;
  saleByCategory:any;
  saleByCategoryLengthCheck:boolean = false;
  lastMonthSales:any;
  lastMonthSalesLengthCheck:boolean = false;

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

mapObject(data) {
  return {name: data.name, value: data.value};
}
  onVendorChange(event) {
    if (event.value == this.defaultSelected) {
      this.vendorID = '';
    } else {
      this.vendorID = event.value;
    }
    this.getRevenue();
    this.getOrderAnalysis();
    this.getProductAnalysis();
    this.getTopSoldItems();
    this.getSalesByCity();
    this.getSaleByCategory();
    this.getMonthAnalysis();
    this.getVendorSales();

  }

  getVendors() {
    this.vendorService.getVendorsList(1, 150).then(resp => {
      if (resp) {
        this.vendors = resp.data.results;
      }
    });
  }


  dateFilter() {
    if (this.start_date && this.end_date) {
      this.getRevenue();
      this.getOrderAnalysis();
      this.getTopSoldItems();
      this.getSalesByCity();
      this.getSaleByCategory();
      this.getVendorSales();

    } else {
      this.getRevenue();
      this.getOrderAnalysis();
      this.getTopSoldItems();
      this.getSalesByCity();
      this.getSaleByCategory();
      this.getVendorSales();
    }
  }

  getRevenue() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }
    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getRevenue(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      if (resp) {
        this.loading = false;
        this.netSale = resp.data.net_sale;
        this.inventorySize = resp.data.inventory_size;
        this.totalSale = resp.data.total_sale;
      }
    })
  }


  getOrderAnalysis() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }

    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getOrderAnalysis(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.average_basket_size = (resp.data.average_basket_size).toFixed(3);
        this.average_basket_value = (resp.data.average_basket_value).toFixed(3);
        this.canceled_orders_count = resp.data.canceled_orders_count;
        this.returned_orders_count = resp.data.returned_orders_count;
        this.total_orders = resp.data.total_orders;
      }
    })
  }


  getSaleByCategory() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }

    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getSaleByCategory(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.saleByCategory = resp.data;
        if (this.saleByCategory.length) {
          this.saleByCategoryLengthCheck = true;
        } else {
          this.saleByCategoryLengthCheck = false;
        }
      }
    })
  }


  getProductAnalysis() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }
    this.dashboardService.getProductAnalysis(this.is_vendor,this.vendorID).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.total_active_products_count = resp.data.total_active_products_count;
        this.total_collections_count = resp.data.total_collections_count;
        this.total_inactive_products_count = resp.data.total_inactive_products_count;
        this.total_product_group_count = resp.data.total_product_group_count;
        this.total_products_count = resp.data.total_products_count;
        this.total_vendor_count = resp.data.total_vendor_count;        
      }
    })
  }


  getTopSoldItems() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }
    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getTopTenSoldItems(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.topSolditems = (resp.data).map(this.mapObject);
        if (this.topSolditems.length) {
          this.soldItemLengthCheck = true;
        } else {
          this.soldItemLengthCheck = false;
        }
      }
    })
  }


  getSalesByCity() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }
    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getSaleByCity(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.saleByCity = (resp.data).map(this.mapObject);  
        if (this.saleByCity.length) {
          this.saleByCityLengthCheck = true;
        } else {
          this.saleByCityLengthCheck = false;
        }
      }
    })
  }


  getMonthAnalysis() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }
    this.dashboardService.getMonthAnalysis(this.is_vendor,this.vendorID).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.lastMonthSales = resp.data;
        if (this.lastMonthSales.length) {
          this.lastMonthSalesLengthCheck = true;
        } else {
          this.lastMonthSalesLengthCheck = false;
        }
      }
    })
  }

  getVendorSales() {
    this.loading = true;
    if (!this.vendorID) {
      this.vendorID = '';
    }

    if (!this.start_date && !this.end_date) {
      this.start_date = null;
      this.end_date = null;
    }
    this.dashboardService.getVendorSales(this.is_vendor,this.vendorID,this.start_date, this.end_date).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.vendor_name = resp.data[0].name;
        this.commission_value = resp.data[0].commission_value;
        this.paid_value = resp.data[0].paid_value;
        this.pending_value = resp.data[0].pending_value;
        this.total_vendor_orders = resp.data[0].total_orders;
        this.total_value = resp.data[0].total_value;
      }
    })
  }


  ngOnInit(): void {
    let todayDate: Date = new Date();
    this.start_date = moment(todayDate).format('YYYY-MM-DD');
    this.end_date = moment(todayDate).format('YYYY-MM-DD');
    this.defaultSelected = '';
    if (!this.is_vendor){
      this.getVendors();
    }
    this.getRevenue();
    this.getOrderAnalysis();
    this.getProductAnalysis();
    this.getTopSoldItems();
    this.getSalesByCity();
    this.getSaleByCategory();
    this.getMonthAnalysis();
    this.getVendorSales();
  }

}
