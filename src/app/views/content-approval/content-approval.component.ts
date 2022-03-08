import { VendorsService } from './../vendors/vendors.service';
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
    private contentApprovalService: ContentApprovalService,
    private snackbarService: MatSnackBar,
    private vendorsService : VendorsService

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
      selector: "status",
      cell: row => `<span class="label ${row.status == 'Approved' ? 'success' : ''}">${row.status == 'Disapproved' ? 'Dispproved' : 'Approved'}</span>`

    },
    {
      title: "Action by",
      selector: "action_perform_by"
    },
    {
      title: "Updated at",
      selector: "action_perform_at",
      pipe: "date",
      dateFormat: "h:mm a MMM d"
    }
  ];
  approvalRequests = [];
  contentApprovalFilters = [];

  filterString: string = "";
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  rowActions = row => {
    let actions = [];
    if (row.status =='Disapproved'){
      actions.push('Approve');
      actions.push('View Reason');

    } else if(row.status =='Approved') {
      actions.push('Disapprove')
    } else {
      actions.push('Approve');
      actions.push('Disapprove');
    }
    return actions;
  }
  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getApprovals();
  }

  onRowAction(data) {
    if(data.action === "Disapprove") {
      let dialogRef = this.dialog.open(DisapproveRequestDialog, {
        width: "600px",
        data: {
          id: data.row.id,
          status: "Disapproved"
        }
      });
      dialogRef.afterClosed().subscribe(applied => {
        if(applied) {
          this.getApprovals();
        }
      });
    }

    if(data.action === "Approve") {
     let mainObj = {
        id: data.row.id,
        status: 'Approved'
      }
      this.contentApprovalService.updateApprovalStatus(mainObj).then((resp) => {
        this.loading = false;
        if(resp) {
          this.snackbarService.open("Content approved.", "", {duration: 3000});
          this.getApprovals();
        }
      })
    }


    if (data.action === 'View Reason')  {
      let dialogRef = this.dialog.open(ContentDisapprovalReasonDialog, {
        width: "600px",
        data: {
          id: data.row.id,
          reason: data.row.reason
        }
      });

    }
  }

  getApprovals() {
    this.loading = true;
    this.contentApprovalService.getApprovalRequests(this.pageNumber, this.pageSize, this.filterString).then(resp => {
      this.loading = false;
      if(resp) {
        this.approvalRequests = resp.data.results;
      }
    })
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 50).then(resp => {
      if (resp) {
        let filters = [
          {
            title: "Status",
            key: 'status',
            values: [
              {
                value: "Approved",
                label: "Approved"
              },
              {
                value: "Disapproved",
                label: "Disapproved"
              }
            ]
          }
        ];

          let vendors = [];
          vendors = resp.data.results.map(vendor => {
            return {
              value: vendor.id,
              label: vendor.name
            }
          });
          filters.push({
            title: "Vendor",
            key: "vendor",
            values: vendors
          });
        this.contentApprovalFilters = filters;
      }
    })
  }

  onFilter(filters) {
    this.pageNumber = 1;
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getApprovals();
  }

  ngOnInit(): void {
    this.getApprovals();
    this.getVendors();
  }

}

@Component({
  selector: 'disapprove-request-dialog',
  templateUrl: './dialogs/disapprove-request-dialog.html',
})
export class DisapproveRequestDialog {
  constructor(
    public dialogRef: MatDialogRef<DisapproveRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private contentApprovalService: ContentApprovalService,
    private snackbarService: MatSnackBar
    ) {
}

  loading: boolean = false;
  
  contentApprovalForm = this.fb.group({
    reason: ['', [Validators.required]]
  })
  onSubmit() {
    this.loading = true;
    let mainObj = this.contentApprovalForm.value;
    mainObj.id = this.data.id;
    mainObj.status = this.data.status;
    this.contentApprovalService.updateApprovalStatus(mainObj).then((resp) => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Content disapproved.", "", {duration: 3000});
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    
  }
}


@Component({
  selector: 'content-dissapproval-reason-dialog',
  templateUrl: './dialogs/content-dissaproval-reason-dialog.html',
})
export class ContentDisapprovalReasonDialog {
  constructor(
    public dialogRef: MatDialogRef<ContentDisapprovalReasonDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private contentApprovalService: ContentApprovalService,
    private snackbarService: MatSnackBar
    ) {
}

  reason = '';

  ngOnInit(): void {
    this.reason = this.data.reason
  }
}

