import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ContentApprovalService } from './content-approval.service';


@Component({
  selector: 'app-content-approval',
  templateUrl: './content-approval.component.html',
  styleUrls: ['./content-approval.component.scss']
})
export class ContentApprovalComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authservice: AuthService,
    private contentApprovalService: ContentApprovalService
  ) { }

  loading: boolean = true;
  URLS = URLS;

  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: 'title'
    },
    {
      title: "Type",
      selector: "content_type"
    },
    {
      title: "Vendor",
      selector: "vendor_name"
    },
    {
      title: "Requested at",
      selector: "requested_at",
      pipe: "date",
      dateFormat: "h:mm a MMM d"
    },
    {
      title: "Status",
      selector: "status"
    },
    {
      title: "Action by",
      selector: "action_performed_by"
    },
    {
      title: "Updated at",
      selector: "action_performed_at"
    }
  ];
  approvalRequests = [];
  rowActions: string[] = [];
  filterString: string = "";
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getApprovals();
  }

  onRowAction(data) {
    if (data.action === "Delete") {}
  }

  getApprovals() {
    this.loading = true;
    this.contentApprovalService.getApprovalRequests(this.pageNumber, this.pageSize, this.filterString).then(resp => {
      this.loading = false;
      if(resp) {
        this.approvalRequests = resp.data;
      }
    })
  }


  ngOnInit(): void {
    // this.getApprovals();
  }

}


