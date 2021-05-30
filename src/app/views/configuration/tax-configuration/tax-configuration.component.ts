import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLs from '../../../shared/urls';


@Component({
  selector: 'app-tax-configuration',
  templateUrl: './tax-configuration.component.html',
  styleUrls: ['./tax-configuration.component.scss']
})
export class TaxConfigurationComponent implements OnInit {

  constructor(private router: Router) { }

  loading: boolean = false;

  goBack() {
    this.router.navigate([URLs.configuration]);
  }

  ngOnInit(): void {
  }

}
