import { CdkDragDrop, CdkDragSortEvent, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
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

  loading: boolean = true;
  URLS = URLS;

  categories = [];
  categoryActions: string[] = [];
  activeCategory = null;

  getMainCategories() {
    this.loading = true;
    this.categoryService.getMainCategories().then(resp => {
      this.loading = false;
      if(resp) {
        this.categories = resp.data;
      }
    });
  }

  getSubCategories(mainIndex) {
    let mainCategory = this.categories[mainIndex];
    this.categoryService.getSubCategories(mainCategory.id).then(resp => {
      mainCategory.loading = false;
      if(resp) {
        mainCategory.sub_category = resp.data;
      }
    })
  }

  getSuperSubCategories(mainIndex, subIndex) {
    let subCategory = this.categories[mainIndex].sub_category[subIndex];
    this.categoryService.getSuperSubCategories(subCategory.id).then(resp => {
      subCategory.loading = false;
      if(resp) {
        subCategory.super_sub_category = resp.data;
      }
    })
  }




  mainCategorySort(event: CdkDragDrop<any[]>) {
    
    if(event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
      this.sortCategoryCall(this.categories, "main_category");
    }
  }

  mainCategoryDragStart(index) {
    let mainCategory = this.categories[index];
    mainCategory.open = false;
  }

  subCategorySort(event: CdkDragDrop<any[]>, mainIndex) {
    
    let subCategories = this.categories[mainIndex].sub_category;
    moveItemInArray(subCategories, event.previousIndex, event.currentIndex);
    this.sortCategoryCall(subCategories, "sub_category");
  }

  subCategoryDragStart(mainIndex, subIndex) {
    let mainCategory = this.categories[mainIndex];
    let subCategory = mainCategory.sub_category[subIndex];
    subCategory.open = false;
  }

  superSubCategorySort(event, mainIndex, subIndex) {
    let subCategory = this.categories[mainIndex].sub_category[subIndex];
    let superSubCategories = subCategory.super_sub_category;
    moveItemInArray(superSubCategories, event.previousIndex, event.currentIndex);
    this.sortCategoryCall(superSubCategories, "super_sub_category");
  }

  sortCategoryCall(categoriesArray, type) {
    this.loading = true;
    let categoryData = categoriesArray.map((category, index) => {
      return {
        id: category.id,
        position: index + 1
      }
    });
    this.categoryService.updateCategoryPosition(type, categoryData).then(resp => {
      this.loading = false;
    });
  }

  toggleMainCategory(index) {
    let mainCategory = this.categories[index];
    if(mainCategory.open) {
      mainCategory.open = false;
    } else {
      mainCategory.loading = true;
      mainCategory.open = true;
      mainCategory.sub_category = [];
      this.getSubCategories(index);
    }
  }

  toggleSubCategory(mainIndex, subIndex) {
    let subCategory = this.categories[mainIndex].sub_category[subIndex];
    if(subCategory.open) {
      subCategory.open = false;
    } else {
      subCategory.loading = true;
      subCategory.open = true;
      subCategory.super_sub_category = [];
      this.getSuperSubCategories(mainIndex, subIndex);
    }
  }

  addSubCategory(event, index) {
    event.preventDefault();
    this.router.navigate(['/', URLS.categories, URLS.newSubCategory, index]);
  }

  rowActionsToggle(event, id, is_active, type) {
    event.stopPropagation();
    let actions = ["Edit"];
    is_active ? actions.push("Make offline") : actions.push("Make online");
    actions.push("Delete");
    this.categoryActions = actions;
    this.activeCategory = {
      id,
      type,
      is_active
    }
  }

  changeCategoryStatus(id, type, status) {
    this.categoryService.changeCatgeoryStatus(id, type, status).then(resp => {
      if(resp) {
        if(resp.data.detail) {
          this.getMainCategories();
        }
      }
    });
  }

  deleteCategory(id, type) {
    this.loading = true;
    this.categoryService.deleteCatgeory(id, type).then(resp => {
      this.loading = false;
      if(resp) {
        this.getMainCategories();
      }
    })
  }

  onCategoryAction(action) {
    let id = this.activeCategory.id;
    let type = this.activeCategory.type;
    let status;

    if(action === "Edit"){
      if(type === "main") {
        this.router.navigate(["/", URLS.categories, URLS.editMainCategory, id]);
      } else if(type === "sub") {
        this.router.navigate(["/", URLS.categories, URLS.editSubCategory, id]);
      } else if(type === "supersub") {
        this.router.navigate(["/", URLS.categories, URLS.editSuperSubCategory, id]);
      }
    } else if(action === "Make offline") {
      status = false;
      this.changeCategoryStatus(id, type, status);
    } else if(action === "Make online") {
      status = true;
      this.changeCategoryStatus(id, type, status);
    } else if(action === "Delete") {
      this.deleteCategory(id, type);
    }
  }

  ngOnInit(): void {
    this.getMainCategories();
  }
}
