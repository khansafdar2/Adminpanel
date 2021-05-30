import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import URLs from '../../../shared/urls';
import { UsersService } from './users.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog, private userService: UsersService) { }

  users = [];
  staff = [];
  storeOwner = {};
  loading: boolean = true;

  ngOnInit(): void {
    this.getUsers();
  }

  goBack() {
    this.router.navigate([URLs.configuration]);
  }

  getUsers() {
    this.userService.getUsers().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.users = resp.data.users;
        resp.data.users.forEach(user => {
          if(user.is_superuser) {
            this.storeOwner = user;
          } else {
            this.staff.push(user);
          }
          user.full_access = true;
          for (let [permission, value] of Object.entries(user.permissions)) {
            if(!value) {
              user.full_access = false;
            }
          }
        });
        this.loading = false;
      }
    });
  }

  addUser() {
    this.router.navigate([URLs.userManagement, URLs.add]);
  }

  openUserInfo(id) {
    this.router.navigate([URLs.userManagement, URLs.info, id]);
  }

  openTransferOwnershipDialog() {
    this.dialog.open(TransferOwnershipDialog, {
      width: '600px'
    });
  }

}


@Component({
  selector: 'transfer-ownership-dialog',
  templateUrl: 'dialogs/transfer-ownership.html',
})
export class TransferOwnershipDialog {}
