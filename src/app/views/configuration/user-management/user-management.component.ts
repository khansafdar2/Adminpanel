import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  userInitials: string = "";
  storeOwner = {
    first_name: "",
    last_name: ""
  };
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
            this.userInitials = this.storeOwner.first_name.charAt(0).toUpperCase() + this.storeOwner.last_name.charAt(0).toUpperCase();
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
      width: '600px',
      data: {users: this.users}
    });
  }

}


@Component({
  selector: 'transfer-ownership-dialog',
  templateUrl: 'dialogs/transfer-ownership.html',
})
export class TransferOwnershipDialog {
  constructor(public dialogRef: MatDialogRef<TransferOwnershipDialog>, @Inject(MAT_DIALOG_DATA) public data, private usersService: UsersService) {}

  loading: boolean = false;
  transferId = null;
  formError: string = "";

  transferOwnership() {
    console.log(this.transferId);

    this.usersService.transferOwnership(this.transferId).then(resp => {
      console.log(resp);
      this.dialogRef.close();
    });
  }
}
