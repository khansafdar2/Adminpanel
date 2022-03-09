import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import URLS from '../shared/urls';

@Component({
  selector: 'app-featured-apps',
  templateUrl: './featured-apps.component.html',
  styleUrls: ['./featured-apps.component.scss']
})
export class FeaturedAppsComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  URLs = URLS;
  userPermissions = this.authService.user_permissions;

  ngOnInit(): void {
  }

}
