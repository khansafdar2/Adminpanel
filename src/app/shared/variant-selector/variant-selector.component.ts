import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'variant-selector',
  templateUrl: './variant-selector.component.html',
  styleUrls: ['./variant-selector.component.scss']
})
export class VariantSelectorComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  openDialog() {
    let dialogRef = this.dialog.open(VariantSelectorDialog, {
      width: "600px"
    });
  }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'variant-selector-dialog',
  templateUrl: './dialogs/variant-selector-dialog.html',
})
export class VariantSelectorDialog {
  constructor(
    public dialogRef: MatDialogRef<VariantSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar
  )
  {}

  loading: boolean = false;
}
