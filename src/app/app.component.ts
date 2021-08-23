import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kees-dashboard';

  ngOnInit() {
    console.log("Kees Dashboard: v1.4");
  }
}
