import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private usersService: UsersService, public dialog: MatDialog) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  userId = null;
  displayedColumns: string[] = ['date', 'ip_address', 'location'];
  dataSource = [];
  userPermissions = {
    dashboard: false,
    theme: false,
    products: false,
    orders: false,
    customer: false,
    discounts: false,
    configuration: false
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
      configuration: false
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
        console.log(resp.data);
        this.userDetail = resp.data;
        this.dataSource = resp.data.last_login_list;
        this.loading = false;
      }
    })
  }

  saveInfo() {
    this.loading = true;
    let data = {
      id: this.userDetail.id,
      first_name: this.userDetail.first_name,
      last_name: this.userDetail.last_name,
      username: this.userDetail.username,
      email: this.userDetail.email,
      newsletter: this.userDetail.newsletter,
      permissions: this.userDetail.permissions
    }

    delete data.permissions.id;

    this.usersService.updateUser(data).then(resp => {
      if(resp) {
        console.log(resp);
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
    console.log(this.data.password, this.data.confirm_password);
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
        console.log(resp);
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
