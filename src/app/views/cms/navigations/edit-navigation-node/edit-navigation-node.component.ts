import { Component, OnInit, Input  } from '@angular/core';
import { NavigationSelectorDialogComponent } from 'src/app/views/cms/navigations/navigation-selector-dialog/navigation-selector-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-navigation-node',
  templateUrl: './edit-navigation-node.component.html',
  styleUrls: ['./edit-navigation-node.component.scss']
})
export class EditNavigationNodeComponent implements OnInit {

  @Input() navNodeToUpdate : any ;
  activeIndex: any
  constructor(
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
  }
  ngOnChanges() : void{
  }
  changeNavigation() {
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
    });
  }
}
