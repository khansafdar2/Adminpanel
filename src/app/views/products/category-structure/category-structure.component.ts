import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-category-structure',
  templateUrl: './category-structure.component.html',
  styleUrls: ['./category-structure.component.scss']
})
export class CategoryStructureComponent implements OnInit {

  constructor() { }

  URLS = URLS;
  loading: boolean = false;
  searchField:FormControl = new FormControl("");
  filteredCategories: Observable<any[]>;
  categories = [
    {
      id: 1,
      name: "Main category 1",
      sub_category: [
        {
          id: 2,
          name: "Sub Category 1"
        },
        {
          id: 3,
          name: "Sub Category 2"
        }
      ]
    },
    {
      id: 4,
      name: "Main category 2",
      sub_category: []
    }
  ]

  ngOnInit(): void {
    this.filteredCategories = this.searchField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCategories(value))
    );
  }

  private _filterCategories(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : "";
    let tempCategories = [];
    this.categories.forEach(mainCategory => {
      if(mainCategory.name.toLowerCase().includes(filterValue)) {
        let tempCategory = {
          id: mainCategory.id,
          name: mainCategory.name,
          sub_category: []
        }

        let tempSubCategories = [];
        mainCategory.sub_category.forEach(subCategory => {
          if(subCategory.name.toLowerCase().includes(filterValue)) {
            tempSubCategories.push({
              id: subCategory.id,
              name: subCategory.name
            });
          }
        });
        tempCategory.sub_category = tempSubCategories
        tempCategories.push(tempCategory);
      } else {
        let tempSubCategories = [];
        mainCategory.sub_category.forEach(subCategory => {
          if(subCategory.name.toLowerCase().includes(filterValue)) {
            tempSubCategories.push(subCategory);
          }
        });

        if(tempSubCategories.length > 0) {
          let tempCategory = {
            id: mainCategory.id,
            name: mainCategory.name,
            sub_category: tempSubCategories
          }

          tempCategories.push(tempCategory);
        }
      }
    });
    return tempCategories;
  }

}
