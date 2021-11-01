import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('selector') selector;
  @ViewChild('subCategoryWrapper') subCategoryWrapper;
  @ViewChild('superSubCategoryWrapper') superSubCategoryWrapper;

  @Input() value = null;

  @Output() valueChange = new EventEmitter<any>();

  valueType = 'handle';
  mainCategories = [];
  subCategories = [];
  superSubCategories = [];
  setWrapperAsSubcategory: boolean = false;
  setWrapperAsSuperSubcategory: boolean = false;

  activeMainCategory = null;
  activeSubCategory = null;
  subCategoriesLoading: boolean = false;
  superSubCategoriesLoading: boolean = false;

  getMainCategories() {
    this.categoryService.getMainCategories().then(resp => {
      if(resp) {
        this.mainCategories = resp.data;
      }
    });
  }

  getSubCategories() {
    this.categoryService.getSubCategories(this.activeMainCategory.id).then(resp => {
      this.subCategoriesLoading = false;
      if(resp) {
        this.subCategories = resp.data;
        this.setWrapperAsSubcategory = true;
      }
    });
  }

  getSuperSubCategories() {
    this.categoryService.getSuperSubCategories(this.activeSubCategory.id).then(resp => {
      this.superSubCategoriesLoading = false;
      if(resp) {
        this.superSubCategories = resp.data;
        this.setWrapperAsSuperSubcategory = true;
      }
    });
  }

  setActiveMainCategory(mainCategory) {
    this.activeMainCategory = mainCategory;
    this.subCategoriesLoading = true;
    this.getSubCategories();
  }

  backToMainCategories() {
    this.setWrapperAsSubcategory = false;
    this.selector.nativeElement.style.height = "";
    this.activeMainCategory = null;
  }

  setActiveSubCategory(subCategory) {
    this.activeSubCategory = subCategory;
    this.superSubCategoriesLoading = true;
    this.getSuperSubCategories();
  }

  backToSubCategories() {
    this.setWrapperAsSuperSubcategory = false;
    this.setWrapperAsSubcategory = true;
    this.activeSubCategory = null;
  }

  onCategorySelectionChange(event: MatCheckboxChange, category, type) {
    if(event.checked) {
      if(this.valueType === 'id') {
        this.value = category.id;
      } else if(this.valueType === 'handle') {
        // this.value = category.handle;
        this.valueChange.emit(category.handle);
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

  ngAfterViewChecked(): void {
    if(this.setWrapperAsSubcategory) {
      setTimeout(() => {
        let subcategoriesHeight = this.subCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = subcategoriesHeight + "px";
        this.setWrapperAsSubcategory = false;
      }, 50);
    } else if(this.setWrapperAsSuperSubcategory) {
      setTimeout(() => {
        let superSubcategoriesHeight = this.superSubCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = superSubcategoriesHeight + "px";
        this.setWrapperAsSuperSubcategory = false;
      }, 50);
    }
  }

}
