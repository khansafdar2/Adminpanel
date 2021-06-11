import { Component, EventEmitter, OnInit, Input, Output, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Debounce } from '../utils';

export interface Column {
  // Title on the column to show on head row
  title?: string;
  // Selector of property in the data object whose value to display in cell
  selector?: string;
  // Whether this column data can be sorted
  sortable?: boolean;
  // Whether this column data should be displayed in label form
  label?: boolean;
  // key value pairs to map data value with label style. e.g {'Active': 'success','Pending': 'warning'}. Possible values: [success, warning, default]
  labelStyles?: {};
  // Makes the cells in column clickable
  clickable?: boolean;
  // Apply pipe to display text. Possible values: [date]
  pipe?: string;
  // Format to apply on date pipe.
  dateFormat?: string;
  // Width of column can be percentage or pixels.
  width?: string,

  cell?: (row: any) => string;
}

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, AfterViewInit {

  constructor() { }

  // The array of data to display
  @Input() data: any[];

  // The columns to display and there options
  @Input() public columns: Column[];

  // Toggle for show search field
  @Input() searchable: boolean;

  // Array of bulk actions, also implements selection column when provided
  @Input() bulkActions: string[];

  // Accepts string[] or a function(row: data{}): string[] to show actions toggle with each row
  @Input() rowActions: any;

  // Takes array of filters to show by there column name. e.g. [{title: "Role", values: ["Admin", "User"]}, ..]
  @Input() filters: any[];

  // Show Add new button above table, calls (addNew) when button is clicked
  @Input() showAddNew: boolean;

  // Options of number of pages to show in pagination.
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];

  // Number of items to show per page.
  @Input() itemsPerPage: number = 10;

  // Whether to show selection check boxes in first column.
  @Input() selectable: boolean = false;

  // The selection model of all selected rows in the table.
  @Input() selection: SelectionModel<[{}]>;

  // Options to show in search columns dropdown.
  @Input() searchColumns: string[]

  // When any bulk action is clicked after selection. Emits {action: string, selection: data[]}
  @Output() bulkAction = new EventEmitter<any>();

  // When any action from row actions dropdown is clicked. Emits {action: string, row: data{}}
  @Output() rowAction = new EventEmitter<any>();

  // When a column is sorted. Emits {active: string('column name'), direction: string('asc', 'desc', '')}
  @Output() sort = new EventEmitter<any>();

  // When search query is entered. Emits string('Search query')
  @Output() search = new EventEmitter<any>();

  // When Add New button is clicked
  @Output() addNew = new EventEmitter<any>();

  // When a clickable cell is clicked. Emits {row: {}, column: string}
  @Output() cellClick = new EventEmitter<any>();

  // Two way binding of selection property.
  @Output() selectionChange = new EventEmitter<SelectionModel<[{}]>>();

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  initialSelection = [];
  currentRow = null;
  displayFilters: boolean = false;
  appliedFilters = [];
  searchQuery: string;
  rowActionsArray = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  toggleFilters() {
    this.displayFilters = !this.displayFilters;
  }

  sortData = function(sort: Sort) {
    this.sort.emit(sort);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.data.forEach(row => this.selection.select(row));
    this.selectionChange.emit(this.selection);
  }

  rowActionsToggle(row) {
    if(typeof this.rowActions === 'function') {
      this.rowActionsArray = Object.assign([], this.rowActions(row));
    }
    this.currentRow = row;
  }

  onRowAction(action: string) {
    this.rowAction.emit({
      action,
      row: this.currentRow,
    });
  }

  onBulkAction(action: string) {
    this.bulkAction.emit({
      action,
      selection: this.selection.selected
    });
  }

  isFilterApplied(filter: string, value: string): any{
    let appliedFilter = this.appliedFilters.find(appliedFilter => appliedFilter.title === filter);
    if(appliedFilter == undefined) {
      return false;
    } else {
      return appliedFilter.values.indexOf(value) > -1
    }
  }

  applyFilter(filter: string, value: string, apply:boolean) {
    var hasFilter = false;
    this.appliedFilters.forEach(appliedFilter => {
      if (appliedFilter.title === filter) {
        hasFilter = true
      }
    });
    if(apply) {
      if(hasFilter) {
        this.appliedFilters.forEach(appliedFilter => {
          if(appliedFilter.title === filter) {
            appliedFilter.values.push(value)
          }
        });
      } else {
        this.appliedFilters.push({
          title: filter,
          values: [value]
        });
      }
    } else {
      this.appliedFilters.forEach((appliedFilter, index) => {
        if(appliedFilter.title === filter) {
          if(appliedFilter.values.length === 1) {
            this.appliedFilters.splice(index, 1);
          }
          appliedFilter.values.splice(appliedFilter.values.indexOf(value), 1);
        }
      });
    }
  }

  onFilterChange(event, index) {
    this.appliedFilters[index].value = event.value;
  }

  onSearch = Debounce(() =>  {
    this.dataSource.filter = this.searchQuery;
    // this.search.emit(this.searchQuery);
  }, 500)

  onAddNew() {
    this.addNew.emit();
  }

  onCellClick(row: {}, column: string) {
    this.cellClick.emit({
      row,
      column
    });
  }

  rowSelectionChange(event, row) {
    if(event) {
      this.selection.toggle(row)
      this.selectionChange.emit(this.selection);
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    if(typeof this.rowActions === 'object') {
      this.rowActionsArray = this.rowActions;
    }
    if(this.bulkActions && this.bulkActions.length) {
      this.selectable = true;
    }
    this.displayedColumns = this.columns.map(column => column.selector);

    if(this.selectable) {
      this.displayedColumns.unshift('select');
      this.selection = new SelectionModel(true, []);
    }

    // if((this.selectable) || (this.rowActions && this.rowActions.length)) {
    //   this.displayedColumns.push("actionsColumn");
    // }
    if(this.rowActions) {
      this.displayedColumns.push("actionsColumn");
    }
    if(this.filters && this.filters.length) {
      let appliedFilters = [];
      this.filters.forEach(filter => {
        appliedFilters.push({
          title: filter.title,
          value: ""
        });
      });

      this.appliedFilters = Object.assign([], appliedFilters);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}