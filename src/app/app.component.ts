import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ces-dashboard';

  ngOnInit() {
    document.title = environment.client_name + " dashboard";
    console.log("Version 4.97");
  }
}
