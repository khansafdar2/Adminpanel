import { Component, OnInit, Inject } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { VendorsService } from './vendors.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  constructor(
    private vendorsService: VendorsService,
    private router: Router,
    public dialog: MatDialog,

  ) { }

  loading: boolean = false;
  URLS = URLS;
  searchString: string = "";
  pageSize: number = 20;
  totalCount: number = 0;
  page: number = 1;
  vendors = []; 
  filterString = '';

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  orderSelection: SelectionModel<[]> = new SelectionModel(true, []);

  rowActions = row => {
    let actions = [];
    // actions.push(row.is_active ? "Deactivate" : "Activate");
    actions.push("Delete");
    return actions;
  }

  displayedColumns: Column[] = [
    {
      title: "Name",
      selector: "name",
      clickable: true
    },
    {
      title: "Email",
      selector: "email"
    },
    {
      title: "Date",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Is Active",
      selector: "is_active",
      label: true,
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`,
      labelStyles: {
        "false": "default",
        "true": "success"
      }
    }
  ];

  filtersArray = [
    {
      title: "Status",
      key: "status",
      values: [
        {
          label: "Active",
          value: "active"
        },
        {
          label: "Inactive",
          value: "inactive"
        }
      ]
    }
    
  ]

  searchColumns = [
    {
      label: "Name",
      value: "name"
    },
    {
      label: "Email",
      value: "email"
    }
  ];

  onFilter(filters) {
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if(filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getVendors();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.vendors, URLS.edit, data.row.id]);
  }

  
  onRowAction(data) {
    if(data.action === "Delete") {
      
      let dialogRef = this.dialog.open(DeleteVendorDialog, {
        width: "600px",
        data: {
          vendorID: data.row.id
        }
      });
  
      dialogRef.afterClosed().subscribe(applied => {
        if(applied) {
          // this.productSelection.clear();
          // this.getProducts();
        }
      });
    }
  }

  onSearch(data) {
    this.searchString = data.query.replaceAll("#", "") + "&column=" + data.column;
    this.page = 1;
    this.getVendors();
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getVendors();
  }

  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(this.page, this.pageSize, this.searchString, this.filterString).then(resp => {
      this.loading = false;
      if(resp) {
        this.totalCount = resp.data.count;
        this.vendors = resp.data.results;
        console.log(resp)
      }
    });
  }

  ngOnInit(): void {
    this.getVendors();
  }

}

@Component({
  selector: 'delete-vendor-dialog',
  templateUrl: '/dialogs/delete-vendor-dialog.html',
})
export class DeleteVendorDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteVendorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private vendorsService: VendorsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,

  ) {
    this.vendorID = this.data.vendorID
  }

  vendorDeleteForm = this.fb.group({
    vendorChoice : [''],
    vendorToAssign : [''],
    products : [''],
    proGroups : [''],
    collection : [''],

  });

  onSubmit(){
    this.loading = true;
    this.apiString = this.vendorID 
    if (this.vendorDeleteForm.get('vendorChoice').value == 'reassign')
    {
      
      this.apiString += '?new_vendor=' + this.vendorDeleteForm.get('vendorToAssign').value
      this.apiString += this.vendorDeleteForm.get('products').value ? '&products=reassign'  : '&products=delete' 
      this.apiString += this.vendorDeleteForm.get('proGroups').value ? '&product_groups=reassign'  : '&product_groups=delete' 
      this.apiString += this.vendorDeleteForm.get('products').value ? '&collections=reassign'  : '&collections=delete' 
    }
    console.log( 'api string', this.apiString)
    this.vendorsService.deleteVendor(this.apiString).then((resp) => {
      this.loading = false;
      if(resp) {
        this.snackBar.open("vendor Deleted successfully.", "", {duration: 3000});
        this.dialogRef.close(true);
        

      }

    })
  }
  
  onActionChange() {
    if (this.vendorDeleteForm.value.vendorChoice == 'delete')
    {
      this.btnDissabled = false 
      this.showAssignOptions = false
    }
    else {
      this.btnDissabled = true 
      this.showAssignOptions = true
      this.vendorsService.getVendorsList(1, 100).then(resp => {
        if(resp) {
          console.log(resp.data.results)
          this.vendors = resp.data.results
        }
      })
    }
  }

  vendorSelect(){
    this.btnDissabled = false
  }

  btnDissabled = true
  vendorChoice = ''
  apiString = ''
  vendors = []
  vendorID = ''
  loading = false
  showAssignOptions = false

}



