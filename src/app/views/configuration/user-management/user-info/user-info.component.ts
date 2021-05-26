import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(private router: Router) { }

  displayedColumns: string[] = ['date', 'ip_address', 'location'];
  dataSource = [
    {
      date: '20 Nov 2020',
      ip_address: '119.73.120.21',
      location: 'Lahore, Pakistan'
    },
    {
      date: '20 Nov 2020',
      ip_address: '119.73.120.21',
      location: 'Lahore, Pakistan'
    },
    {
      date: '20 Nov 2020',
      ip_address: '119.73.120.21',
      location: 'Lahore, Pakistan'
    },
    {
      date: '20 Nov 2020',
      ip_address: '119.73.120.21',
      location: 'Lahore, Pakistan'
    }
  ]

  ngOnInit(): void {
  }


  goBack() {
    this.router.navigate([URLS.userManagement, URLS.all]);
  }

}
