import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NavigationSelectorDialogComponent } from 'src/app/views/cms/navigations/navigation-selector-dialog/navigation-selector-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-navigation-node',
  templateUrl: './edit-navigation-node.component.html',
  styleUrls: ['./edit-navigation-node.component.scss']
})
export class EditNavigationNodeComponent implements OnInit {

  @Input() navNodeToUpdate : any ;
  activeIndex: any
  @Output() getSearchStatusChange = new EventEmitter<string>();
  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }
  
  ngOnInit(): void {
  }
  ngOnChanges() : void{
    
    // this.title = this.navNodeToUpdate.title
  }
  changeNavTitle( event)
  {
    
    // this.navNodeToUpdate.title = this.title
    // const node = this.nav[this.navIndex]
    // this.nav[this.navIndex] = {"title": event.target.value, url: '' }
  }
  changeNavigation() {
    // this.activeIndex = index;
    let dialogRef = this.dialog.open(NavigationSelectorDialogComponent, {
      width: "600px",
      data: {
        selected: "",
        valueType: "object.handle",
        value: ''
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      this.navNodeToUpdate.link = value
      // this.data.categories[index].handle = value.handle;
      // this.data.categories[index].category_name = value.name;
    });
  }
}
