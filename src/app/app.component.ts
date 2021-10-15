import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kees-dashboard';

  ngOnInit() {
    console.log("Dev Ops ka Bara issue.");
  }
}
