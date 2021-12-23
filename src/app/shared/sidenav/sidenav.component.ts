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
  is_vendor = this.authService.user.is_vendor;

  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    document.body.onclick = (event: PointerEvent) => {
      this.sideDrawer = "";
    }
  }
}
