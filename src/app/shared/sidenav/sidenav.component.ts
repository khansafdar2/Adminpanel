import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from '../urls';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private authService: AuthService) { }

  Urls = URLS;
  sideDrawer: string = "";
  userPermissions = this.authService.user_permissions;

  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;
  }

  ngOnInit(): void {
  }

}
