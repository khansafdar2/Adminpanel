import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  constructor(private router: Router) { }

  loading: boolean = false;

  goBack() {
    this.router.navigate([URLS.configuration]);
  }

  ngOnInit(): void {
  }

}
