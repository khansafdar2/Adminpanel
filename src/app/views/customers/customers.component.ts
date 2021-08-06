import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(
    private customersService: CustomersService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loading: boolean = false;
  URLS = URLS;
  customers = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;
  displayedColumns: Column[] = [
    {
      title: "Name",
      selector: "first_name",
      cell: row => row.first_name + " " + row.last_name,
      clickable: true
    },
    {
      title: "Email",
      selector: "email"
    },
    {
      title: "Phone",
      selector: "phone"
    }
  ];
  rowActions: string[] = ["Delete"];

  getCustomers() {
    this.loading = true;
    this.customersService.getCustomersList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.customers = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCustomers();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.customers, URLS.edit, data.row.id]);
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(CustomerDeleteDialog, {
      width: "600px",
      data: {
        customer: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if(deleted) {
        this.getCustomers();
      }
    });
  }

  ngOnInit(): void {
    this.getCustomers();
  }

}


@Component({
  selector: 'customer-delete-dialog',
  templateUrl: './dialogs/customer-delete-dialog.html',
})
export class CustomerDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<CustomerDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private customerService: CustomersService) {
  }

  loading: boolean = false;

  deleteCustomer() {
    this.loading = true;
    this.customerService.deleteCustomer(this.data.customer.id).then(resp => {
      if(resp) {
        this.snackbar.open("Customer deleted successfully.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    });
  }
}
