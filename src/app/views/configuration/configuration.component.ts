import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import URLS from '../../shared/urls';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor(private router: Router,
    public authService: AuthService
    ) { }

  userPermissions = this.authService.user_permissions;

  ngOnInit(): void {
  }

  goToSettings(route) {
    this.router.navigate([URLS[route]]);
  }

}
