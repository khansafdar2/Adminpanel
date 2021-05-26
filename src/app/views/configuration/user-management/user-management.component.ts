import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import URLs from '../../../shared/urls';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate([URLs.configuration]);
  }

  addUser() {
    this.router.navigate([URLs.userManagement, URLs.add]);
  }

  openUserInfo(id) {
    this.router.navigate([URLs.userManagement, URLs.info, id]);
  }

  openTransferOwnershipDialog() {
    const transferOwnershipRef = this.dialog.open(TransferOwnershipDialog, {
      width: '600px'
    });

    // transferOwnsershipRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

}


@Component({
  selector: 'transfer-ownership-dialog',
  templateUrl: 'dialogs/transfer-ownership.html',
})
export class TransferOwnershipDialog {}
