import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import URLS from 'src/app/shared/urls';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category-structure',
  templateUrl: './category-structure.component.html',
  styleUrls: ['./category-structure.component.scss']
})
export class CategoryStructureComponent implements OnInit {

  constructor(private router: Router, private categoryService: CategoryService) { }

  URLS = URLS;
  loading: boolean = true;
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
  categoriesAccordion: any[] = this.categories;

  addSubCategory(index) {
    this.router.navigate(['/', URLS.categories, URLS.newSubCategory, index]);
  }

  onMainCategoryOpen(event, i) {
    console.log(event, i);
    this.categoriesAccordion[i].loading = true;
    let subCategories = [
      {
        id: 2,
        name: "Sub Category 1"
      },
      {
        id: 3,
        name: "Sub Category 2"
      }
    ];
    this.categoriesAccordion[i].sub_category = subCategories;
    this.categoriesAccordion[i].loading = false;
  }

  onSubCategoryOpen(event, i, j) {
    this.categoriesAccordion[i].sub_category[j].loading = true;
    let subCategories = [
      {
        id: 6,
        name: "Sub sub Category 1"
      },
      {
        id: 7,
        name: "Sub sub Category 2"
      }
    ];
    this.categoriesAccordion[i].sub_category[j].sub_category = subCategories;
    this.categoriesAccordion[i].sub_category[j].loading = false;
  }

  getMainCategories() {
    this.categoryService.getMainCategories().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.filteredCategories = this.searchField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCategories(value))
    );

    this.getMainCategories();
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
