import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLS from '../../shared/urls';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToSettings(route) {
    this.router.navigate([URLS[route]]);
  }

}
