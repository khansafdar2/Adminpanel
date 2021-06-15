import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private usersService: UsersService, private snackbarService: MatSnackBar) { }

  loading: boolean = false;
  userForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required]]
  });

  userPermissions = {
    dashboard: false,
    theme: false,
    products: false,
    orders: false,
    customer: false,
    discounts: false,
    configuration: false
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([URLS.userManagement]);
  }

  onSubmit() {
    this.loading = true;
    let data = this.userForm.value;
    data.permissions = this.userPermissions;
    this.usersService.addUser(data)
    .then(resp => {
      this.loading = false;
      console.log(resp.response);
      if(resp.response.status === 400) {
        if(resp.response.data.email[0] === "This field must be unique.") {
          this.snackbarService.open("An account with this email address already exists.", "", {duration: 3000});
        }
      } else {
        if(resp) {
          console.log(resp.data);
          this.loading = false;
          this.snackbarService.open('Invitation sent to user.', "", {duration: 3000});
          this.goBack();
        }
      }
    }).catch(error => {
      console.log(error);
    })
  }

}
