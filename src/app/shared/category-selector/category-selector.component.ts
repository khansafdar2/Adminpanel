import { concat } from 'rxjs';
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

  @Input() value: any;
  @Input() multiple = false;
  @Input() valueType = 'handle';

  @Output() valueChange = new EventEmitter<any>();

  mainCategories = [];
  subCategories = [];
  superSubCategories = [];
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
      category_name: category.name,
      category_type: type
    }
    if (event.checked) {
      if (this.valueType === 'id') {
        if (this.multiple) {
          if (this.value) {
            this.value.push(category.id);
          } else {
            this.value = [];
            this.value.push(category.id);
          }
        } else {
          this.value = category.id;
        }
      } else if (this.valueType === 'handle') {
        if (this.multiple) {
          if (this.value) {
            this.value.push(category.handle);
          } else {
            this.value = [];
            this.value.push(category.handle);
          }
        } else {
          this.value = category.handle;
        }
      } else if (this.valueType === 'object.handle') {
        if (this.multiple) {
          if (this.value) {
            this.value.push(categoryObj);
          } else {
            this.value = [];
            this.value.push(categoryObj);
          }
        } else {
          this.value = category;
        }
      } else if (this.valueType === 'object.id') {
        if (this.multiple) {
          if (this.value) {
            this.value.push(categoryObj);
          } else {
            this.value = [];
            this.value.push(categoryObj);
          }

        } else {
          this.value = category;
        }
      }
    } else {
      if (this.valueType === 'handle') {
        if (this.multiple) {
          let removeHandle = this.value.indexOf(category.handle);
          this.value.splice(removeHandle, 1);
        } else {
          this.value = null;
        }
      } else if (this.valueType === 'object.handle') {
        if (this.multiple) {
          let removeObjHandleIndex = this.value.findIndex(category => category.category_handle == category.handle);
          this.value.splice(removeObjHandleIndex, 1);
        } else {
          this.value = null;
        }
      } else if (this.valueType === 'object.id') {
        if (this.multiple) {
          let removeObjId = this.value.findIndex(category => category.category_id == categoryObj.category_id);
          this.value.splice(removeObjId, 1);
        } else {
          this.value = null;
        }
      } else if (this.valueType === 'id') {
        if (this.multiple) {
          let removeId = this.value.indexOf(category.id);
          this.value.splice(removeId, 1);
        } else {
          this.value = null;
        }
      }
    }    
    this.valueChange.emit(this.value);
  }

  isCategorySelected(category, type) {
    if (this.valueType === 'id') {
      if (this.multiple) {
        if (this.value) {
          for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].category_id == category.id) {
              return this.value[i].category_id;
            }
          }
        }
      } else {
        this.value === category.id
      }
    } else if (this.valueType === 'handle') {
      if (this.multiple) {
        if (this.value) {
          for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].handle == category.handle) {
              return this.value[i].handle;
            }
          }
        }
      } else {
        return this.value === category.handle;
      }
    } else if (this.valueType === 'object.handle') {
      if (this.multiple) {
        if (this.value) {
          for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].handle == category.handle) {
              return this.value[i].handle;
            }
          }
        }

      } else {
        return this.value.handle === category.handle;
      }
    } else if (this.valueType === 'object.id') {
      if (this.multiple) {
        if (this.value) {
          for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].category_id == category.id && this.value[i].category_type == type) {
              return this.value[i].category_id && this.value[i].category_type;
            }
          }
        }

      } else {
        return this.value === category.id;
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