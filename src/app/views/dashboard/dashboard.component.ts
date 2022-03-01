import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) { 
  }

  loading: boolean = true;
  vendor = this.authService.user.is_vendor;
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
  }

}
