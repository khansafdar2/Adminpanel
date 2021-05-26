import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([URLS.userManagement]);
  }

}
