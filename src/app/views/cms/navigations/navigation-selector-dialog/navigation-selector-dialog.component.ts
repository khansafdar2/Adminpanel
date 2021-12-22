import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation-selector-dialog',
  templateUrl: './navigation-selector-dialog.component.html',
  styleUrls: ['./navigation-selector-dialog.component.scss']
})
export class NavigationSelectorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NavigationSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.selected = this.data.selected;
    this.valueType = this.data.valueType || "handle";
    this.value = {
      handle: this.selected
    }
  }

  valueType: string = "handle";
  selected = null;
  value = null;

  onSave() {
    debugger
    this.dialogRef.close(this.value);
    // if(this.valueType === "handle") {
    //   this.dialogRef.close(this.value.handle);
    // } else if(this.valueType.indexOf("object") === 0) {
    //   this.dialogRef.close(this.value);
    // }
  }

  ngOnInit(): void {
  }

}
