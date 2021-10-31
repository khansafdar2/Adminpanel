import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  logo_img: string = `assets/${environment.client_img_folder}/logo.png`;

  onSignOut() {
    this.authService.signout();
  }

  ngOnInit(): void {
  }

}
