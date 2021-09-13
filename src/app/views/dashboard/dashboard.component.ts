import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService
  ) { }

  loading: boolean = true;
  cardsStats = {
    total_orders: 0,
    total_sale: 0,
    today_orders: 0,
    today_sale: 0
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
  }

}
