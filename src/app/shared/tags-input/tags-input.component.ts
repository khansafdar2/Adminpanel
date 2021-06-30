import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER, SLASH } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss']
})
export class TagsInputComponent implements OnInit {

  constructor() { }

  // Field label
  @Input() label: string = "";
  @Input() placeholder: string = "New tag...";
  @Input() value: string[] = [];
  @Input() removable: boolean = true;

  @Output() valueChange = new EventEmitter<string[]>();
  @Output() change = new EventEmitter<any>();

  inputFormControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA, SLASH];

  removeChip(index) {
    this.value.splice(index, 1);
    this.valueChange.emit(this.value);
    this.change.emit();
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.value.push(value);
    }

    this.inputFormControl.setValue("");
    this.valueChange.emit(this.value);
    this.change.emit();
  }

  ngOnInit(): void {
  }

}
