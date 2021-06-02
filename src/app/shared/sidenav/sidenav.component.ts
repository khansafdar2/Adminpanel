import { Component, OnInit } from '@angular/core';
import URLS from '../urls';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor() { }

  Urls = URLS;
  sideDrawer: string = "";

  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;
  }

  ngOnInit(): void {
  }

}
