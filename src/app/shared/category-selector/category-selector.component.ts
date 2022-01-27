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
        style({ transform: 'translateX(100%)' }),
        animate('250ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-out', style({ transform: 'translateX(100%)' }))
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
  @Input() multiple = false;
  @Input() valueType = 'handle';

  @Output() valueChange = new EventEmitter<any>();

  mainCategories = [];
  subCategories = [];
  superSubCategories = [];
  handleArray = [];
  idArray = [];
  setWrapperAsSubcategory: boolean = false;
  setWrapperAsSuperSubcategory: boolean = false;
  categoryArray = [];
  activeMainCategory = null;
  activeSubCategory = null;
  subCategoriesLoading: boolean = false;
  superSubCategoriesLoading: boolean = false;

  getMainCategories() {
    this.categoryService.getMainCategories().then(resp => {
      if (resp) {
        this.mainCategories = resp.data;
      }
    });
  }

  getSubCategories() {
    this.categoryService.getSubCategories(this.activeMainCategory.id).then(resp => {
      this.subCategoriesLoading = false;
      if (resp) {
        this.subCategories = resp.data;
        this.setWrapperAsSubcategory = true;
      }
    });
  }

  getSuperSubCategories() {
    this.categoryService.getSuperSubCategories(this.activeSubCategory.id).then(resp => {
      this.superSubCategoriesLoading = false;
      if (resp) {
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
    let categoryObj = {
      category_id: category.id,
      category_handle: category.handle,
      category_type: type
    }
    if (event.checked) {
      if (this.valueType === 'id') {
        if (this.multiple) {
          this.idArray.push(category.id);
          this.value = this.idArray;
        } else {
          this.value = category.id;
        }
      } else if (this.valueType === 'handle') {
        if (this.multiple) {
          this.handleArray.push(category.handle);
          this.value = this.handleArray;
        } else {
          this.value = category.handle;
        }
      } else if (this.valueType === 'object.handle') {
        if (this.multiple) {
          this.categoryArray.push(categoryObj)
          this.value = this.categoryArray;
        } else {
          this.value = category;
        }
      } else if (this.valueType === 'object.id') {
        if (this.multiple) {
          this.categoryArray.push(categoryObj);
          this.value = this.categoryArray;
        } else {
          this.value = category;
        }
      }
    } else {
      if (this.valueType === 'handle') {
        if (this.multiple) {
          let removeHandle = this.value.indexOf(category.handle);
          this.handleArray.splice(removeHandle, 1);
          this.value = this.handleArray;
        } else {
          category.handle = '';
          this.value = category.handle;
        }
      } else if (this.valueType === 'object.handle') {
        if (this.multiple) {
          let removeObjHandle = this.value.indexOf(category.handle);
          this.categoryArray.splice(removeObjHandle, 1);
          this.value = this.categoryArray;
        } else {
          category = '';
          this.value = category;
        }
      } else if (this.valueType === 'object.id') {
        if (this.multiple) {
          let removeObjId = this.value.indexOf(category.id);
          this.categoryArray.splice(removeObjId, 1);
          this.value = this.categoryArray;
        } else {
          category = null;
          this.value = category;
        }
      } else if (this.valueType === 'id') {
        if (this.multiple) {
          let removeId = this.value.indexOf(category.id);
          this.idArray.splice(removeId, 1);
          this.value = this.idArray;
        } else {
          category.id = null;
          this.value = category.id;
        }
      }
    }
    this.valueChange.emit(this.value);
  }

  isCategorySelected(category, type) {
    if (this.valueType === 'id') {
    } else if (this.valueType === 'handle') {
      return this.value === category.handle;
    } else if (this.valueType === 'object.handle') {
      return this.value.handle === category.handle;
    } else if (this.valueType === 'object.id') {
      if (this.value) {
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i].id == category.id && this.value[i].type == type) {
            return this.value[i].id && this.value[i].type;
          }
        }
      }
    }
  }


  onCheckboxClick(event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.getMainCategories();

  }

  ngAfterViewChecked(): void {
    if (this.setWrapperAsSubcategory) {
      setTimeout(() => {
        let subcategoriesHeight = this.subCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = subcategoriesHeight + "px";
        this.setWrapperAsSubcategory = false;
      }, 50);
    } else if (this.setWrapperAsSuperSubcategory) {
      setTimeout(() => {
        let superSubcategoriesHeight = this.superSubCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = superSubcategoriesHeight + "px";
        this.setWrapperAsSuperSubcategory = false;
      }, 50);
    }
  }
}
