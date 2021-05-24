import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLs from '../../../shared/urls';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([URLs.configuration]);
  }

}
