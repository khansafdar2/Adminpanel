import { Component, Inject, Input, OnInit } from '@angular/core';
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
    this.multiple = this.data.multiple
    if (!this.multiple) {
      this.value = {
        handle: this.selected
      }
    } else {
      this.value = this.selected
    }
  }





  @Input() value: any;

  categoriesTags:string[] = [];

  valueType: string = "handle";
  selected = null;
  multiple = false;

  onSave() {
    if(this.valueType === "handle") {
      this.dialogRef.close(this.value.handle);
    }   else if (this.valueType === "object.handle") {
      this.dialogRef.close(this.value);
    }
     else if(this.valueType.indexOf("object") === 0) {
      this.dialogRef.close(this.value);
    }
   
  }

  ngOnInit(): void {
  }

}
