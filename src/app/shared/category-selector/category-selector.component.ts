import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/views/products/category-structure/category.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('250ms ease-out', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('250ms ease-out', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class CategorySelectorComponent implements OnInit {

  constructor(
    private categoryService: CategoryService
  ) { }

  value = null;
  valueType = 'handle';
  mainCategories = [];
  subCategories = [];

  activeMainCategory = null;
  subCategoriesLoading: boolean = false;

  getMainCategories() {
    this.categoryService.getMainCategories().then(resp => {
      if(resp) {
        console.log(resp.data);
        this.mainCategories = resp.data;
      }
    });
  }

  getSubCategories() {
    this.categoryService.getSubCategories(this.activeMainCategory.id).then(resp => {
      this.subCategoriesLoading = false;
      if(resp) {
        console.log(resp.data);
        this.subCategories = resp.data;
      }
    })
  }

  getSuperSubCategories() {

  }

  setActiveMainCategory(mainCategory) {
    this.activeMainCategory = mainCategory;
    this.subCategoriesLoading = true;
    this.getSubCategories();
  }

  backToMainCategories() {
    this.activeMainCategory = null;
  }

  onCategorySelectionChange(event: MatCheckboxChange, category, type) {
    if(event.checked) {
      if(this.valueType === 'id') {
        this.value = category.id;
      } else if(this.valueType === 'handle') {
        this.value = category.handle;
      }
    }
  }

  isCategorySelected(category) {
    if(this.valueType === 'id'){
    } else if(this.valueType === 'handle') {
      return this.value === category.handle;
    }
  }

  onCheckboxClick(event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.getMainCategories();
  }

}
