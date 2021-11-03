import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-selector-dialog',
  templateUrl: './category-selector-dialog.component.html',
  styleUrls: ['./category-selector-dialog.component.scss']
})
export class CategorySelectorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CategorySelectorDialogComponent>,
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
    if(this.valueType === "handle") {
      this.dialogRef.close(this.value.handle);
    } else if(this.valueType.indexOf("object") === 0) {
      this.dialogRef.close(this.value);
    }
  }

  ngOnInit(): void {
  }

}
