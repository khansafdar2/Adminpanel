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
  categories = []
  categoriesAccordion: any[] = this.categories;
  categoryActions: string[] = [];

  addSubCategory(index) {
    this.router.navigate(['/', URLS.categories, URLS.newSubCategory, index]);
  }

  onMainCategoryOpen(i) {
    if(this.categoriesAccordion[i].sub_loaded) {
      return false;
    }
    this.categoriesAccordion[i].loading = true;
    this.categoryService.getSubCategories(this.categoriesAccordion[i].id).then(resp => {
      if(resp) {
        this.categoriesAccordion[i].sub_category = resp.data.map(category => {
          return {
            id: category.id,
            name: category.name,
            availability: category.availability,
            sub_loaded: false,
            loading: false,
            sub_category: []
          }
        });
        this.categoriesAccordion[i].sub_loaded = true;
        this.categoriesAccordion[i].loading = false;
      }
    });
  }

  onSubCategoryOpen(i, j) {
    let subCategory = this.categoriesAccordion[i].sub_category[j];
    if(subCategory.sub_loaded) {
      return false;
    }
    subCategory.loading = true;
    this.categoryService.getSuperSubCategories(subCategory.id).then(resp => {
      if(resp) {
        subCategory.sub_category = resp.data.map(category => {
          return {
            id: category.id,
            name: category.name,
            availability: category.availability
          }
        });
        subCategory.sub_loaded = true;
        subCategory.loading = false;
      }
    });
  }

  getMainCategories() {
    this.categoryService.getMainCategories().then(resp => {
      if(resp) {
        this.categories = resp.data;
        console.log(resp.data);
        let categories = resp.data.map(category => {
          return {
            id: category.id,
            name: category.name,
            availability: category.availability,
            sub_loaded: false,
            loading: false,
            sub_category: []
          }
        });
        this.categoriesAccordion = categories;
        this.loading = false;
      }
    });
  }

  rowActionsToggle(event, id, availability) {
    event.stopPropagation();
    let actions = ["Edit"];
    availability ? actions.push("Make offline") : actions.push("Make online");
    this.categoryActions = actions;
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
