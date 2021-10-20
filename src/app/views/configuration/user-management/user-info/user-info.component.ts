import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../users.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
    public dialog: MatDialog,
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  userId = null;
  loggedInUserID = this.authService.user.id;
  displayedColumns: string[] = ['date', 'ip_address', 'location'];
  dataSource = [];
  firstNameField = new FormControl("", [Validators.required]);
  lastNameField = new FormControl("", [Validators.required]);
  userPermissions = {
    dashboard: false,
    theme: true,
    products: false,
    orders: false,
    customer: false,
    discounts: false,
    configuration: false,
    vendor: true
  }
  userDetail = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    newsletter: false,
    username: "",
    permissions: {
      id: null,
      dashboard: false,
      theme: false,
      products: false,
      orders: false,
      customer: false,
      discounts: false,
      configuration: false,
      vendor: false
    }
  };
  nameInitials: string = "";
  loading: boolean = true;

  ngOnInit(): void {
    this.getUserDetail();
  }


  goBack() {
    this.router.navigate([URLS.userManagement, URLS.all]);
  }

  getUserDetail() {
    this.usersService.getUser(this.userId).then(resp => {
      if(resp) {
        this.userDetail = resp.data;
        this.dataSource = resp.data.last_login_list;
        this.firstNameField.setValue(resp.data.first_name);
        this.lastNameField.setValue(resp.data.last_name);
        this.loading = false;
      }
    })
  }

  saveInfo() {
    this.firstNameField.markAsTouched();
    this.lastNameField.markAsTouched();
    if(!this.firstNameField.valid || !this.lastNameField.valid) {
      return false;
    }
    this.loading = true;
    let data = {
      id: this.userDetail.id,
      first_name: this.firstNameField.value,
      last_name: this.lastNameField.value,
      username: this.userDetail.username,
      email: this.userDetail.email,
      newsletter: this.userDetail.newsletter,
      permissions: this.userDetail.permissions
    }

    delete data.permissions.id;

    this.usersService.updateUser(data).then(resp => {
      if(resp) {
        this.loading = false;
        this.router.navigate([URLS.userManagement, URLS.all]);
      }
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordDialog, {
      width: '600px'
    });
  }
}


@Component({
  selector: 'change-password-dialog',
  templateUrl: '../dialogs/change-password.html',
})
export class ChangePasswordDialog {
  constructor(public dialogRef: MatDialogRef<ChangePasswordDialog>, private usersService: UsersService) {}

  loading: boolean = false;
  formError: string = "";
  data = {
    password: "",
    confirm_password: ""
  }

  updatePassword() {
    this.formError = "";
    if(this.data.password === "") {
      this.formError = "Please enter new password.";
    } else if(this.data.confirm_password === "") {
      this.formError = "Please confirm your new password.";
    } else if(this.data.password !== this.data.confirm_password) {
      this.formError = "Both passwords do not match.";
    } else {
      this.loading = true;
      this.usersService.changePassword(this.data).then(resp => {
        if(resp.status === 400) {
          if(resp.data.non_field_errors) {
            this.formError = resp.data.non_field_errors[0];
          }
        } else {
          this.dialogRef.close();
        }
        this.loading = false;
      });
    }
  }
}
