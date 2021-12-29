import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from '../urls';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  Urls = URLS;
  sideDrawer: string = "";
  userPermissions = this.authService.user_permissions;
  is_vendor = this.authService.user.is_vendor;
  vendorID = this.authService.user.id

  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  editVendorRoute(){
    if (this.is_vendor) {
      this.router.navigate(["/", URLS.vendors, URLS.edit, this.vendorID]);
    }
  }

  ngOnInit(): void {
    document.body.onclick = (event: PointerEvent) => {
      this.sideDrawer = "";
    }
  }
}
