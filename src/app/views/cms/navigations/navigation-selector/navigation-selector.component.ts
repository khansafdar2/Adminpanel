import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/views/products/category-structure/category.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NavigationService } from '../navigation.service';
import { PagesService } from '../../pages/pages.service';


@Component({
  selector: 'app-navigation-selector',
  templateUrl: './navigation-selector.component.html',
  styleUrls: ['./navigation-selector.component.scss'],
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
export class NavigationSelectorComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
    private navigationService: NavigationService,
    private pagesService: PagesService,
  ) { }
  @ViewChild('selector') selector;
  @ViewChild('mainCategoryWrapper') mainCategoryWrapper;
  @ViewChild('subCategoryWrapper') subCategoryWrapper;
  @ViewChild('superSubCategoryWrapper') superSubCategoryWrapper;
  @ViewChild('brandsWrapper') brandsWrapper;
  @ViewChild('promotionsWrapper') promotionsWrapper;
  @ViewChild('staticPagesWrapper') staticPagesWrapper;
  
  

  @Input() value = null;
  @Output() valueChange = new EventEmitter<any>();

  @Input() valueType = 'handle';

  $this = this
  navigationTypes= [
    {
      title: "brands",
      type: "brands",
      handle : 'brands',
      fetch : () => this.fetchBrands(this)
    },
    {
      title: "Promotions",
      type: "promotion",
      handle : 'promotions',
      fetch : () => this.fetchPromotions(this)
    },
    {
      title: "categories",
      type: "category",
      handle : 'collection',
      fetch : () => this.getAllCategories(this)
    },
    {
      title: "Categoroy Page",
      type: "category-page",
      handle : 'categories',
      fetch : () => this.getCategoryPages(this)
    },
    {
      title: "Statice Pages",
      type: "static-page",
      handle : 'page',
      fetch : () => this.getStaticPages(this)
    }
    
  ]


  brands = []
  promotions = []
  setWrapperAsBrand = false
  setWrapperAsPromotion = false
  selectedBrand = {name:''}
  selectedPromotion = {name:''}
  selectedStaticPage = {name:''}
  selectedCategory = null
  activeMenu = null
  categoryPage = false
  staticPages = []

  mainCategories = [];
  subCategories = [];
  superSubCategories = [];
  setWrapperAsMaincategory = false
  setWrapperAsSubcategory: boolean = false;
  setWrapperAsSuperSubcategory: boolean = false;
  setWrapperAsStaticPage: boolean = false;

  activeMainCategory = null;
  activeSubCategory = null;
  subCategoriesLoading: boolean = false;
  superSubCategoriesLoading: boolean = false;


  fetchNavigations(navigationType){
    navigationType.fetch()
    this.activeMenu = navigationType
  }
  fetchBrands($this)
  {
    // $this = NavigationSelectorComponent reference
    $this.navigationService.getBrands().then(resp => {
      if(resp) {
        
        console.log('brands', resp.data.results)
        $this.brands = resp.data.results
        $this.brands.splice(0, 0, { 
          name: "all Brands",
          handle: 'all'
         } )
        $this.setWrapperAsBrand = true
      }
    })
  }
  getStaticPages($this)
  {

    $this.pagesService.getPages().then((resp) => {
      debugger
      $this.staticPages = resp.data
      $this.setWrapperAsStaticPage = true
    })
  }
  getCategoryPages($this){
    $this.getMainCategories($this)
    $this.categoryPage = true
  }
  getAllCategories($this)
  {
    $this.categoryPage = false
    $this.getMainCategories($this)
  }
  setSelectedBrand(brand){
    debugger
    this.selectedBrand = brand
    let brandLink = '/' + this.activeMenu.handle + '/'  + brand.handle
    
    this.generateNavLink(brandLink)
  }
  setSelectedPromotion(promotion){
    this.selectedPromotion = promotion
    let brandLink = '/' + this.activeMenu.handle + '/'  + promotion.handle

    this.generateNavLink(brandLink)
  }
  setSelectedStaticPage(page)
  {
    this.selectedStaticPage = page
    let brandLink = '/' + this.activeMenu.handle + '/'  + page.handle

    this.generateNavLink(brandLink) 
  }
  generateNavLink(link){
    this.value = link
    this.valueChange.emit(link);
  }
  backToMainMenu() {
    this.setWrapperAsBrand = false;
    this.setWrapperAsPromotion = false
    this.setWrapperAsSubcategory = false
    this.selector.nativeElement.style.height = "";
    this.brands = [];
    this.promotions = []
    this.mainCategories = []
    this.staticPages = []
  }
  fetchPromotions($this){
    $this.promotions.push({ 
      name: "all promotions",
      handle: 'all'
     })
     $this.setWrapperAsPromotion = true
  }

  getMainCategories($this) {

    $this.categoryService.getMainCategories().then(resp => {
      if(resp) {
        $this.mainCategories = resp.data;
        $this.setWrapperAsMaincategory = true
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
    if (!this.categoryPage)
    {
      this.activeMainCategory = mainCategory;
      this.subCategoriesLoading = true;
      this.getSubCategories();
    }
  }

  backToMainCategories() {
    
    this.setWrapperAsSubcategory = false;
    this.selector.nativeElement.style.height = this.mainCategoryWrapper.nativeElement.clientHeight + "px";
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
      this.selectedCategory = category.handle
      let Link = '/' + this.activeMenu.handle + '/' + category.handle
      this.generateNavLink(Link)
      // if(this.valueType === 'id') {
      //   this.value = category.id;
      // } else if(this.valueType === 'handle') {
      //   this.valueChange.emit(category.handle);
      // } else if(this.valueType === 'object.handle') {
      //   this.valueChange.emit(category);
      // }
    }
  }

  isCategorySelected(category) {
    debugger
    // if(this.valueType === 'id'){
    // } else if(this.valueType === 'handle') {
    //   return this.value === category.handle;
    // } else if(this.valueType === 'object.handle') {
    //   return this.value.handle === category.handle;
    // }
  }

  onCheckboxClick(event) {
    
    event.stopPropagation();
  }

  ngOnInit(): void {

    // this.getMainCategories();
  }

  ngAfterViewChecked(): void {
    if(this.setWrapperAsMaincategory) {
      setTimeout(() => {
        debugger
        let maincategoriesHeight = this.mainCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = maincategoriesHeight + "px";
        this.setWrapperAsMaincategory = false;
        console.log("setWrapperAsMaincategory")
      }, 50);
    }
    else if(this.setWrapperAsSubcategory) {
      setTimeout(() => {
        debugger
        let subcategoriesHeight = this.subCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = subcategoriesHeight + "px";
        this.setWrapperAsSubcategory = false;
        console.log("setWrapperAsSubcategory")
      }, 50);
    }
    else if(this.setWrapperAsSuperSubcategory) {
      setTimeout(() => {
        let superSubcategoriesHeight = this.superSubCategoryWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = superSubcategoriesHeight + "px";
        this.setWrapperAsSuperSubcategory = false;
        console.log("setWrapperAsSuperSubcategory")
      }, 50);
      
    }
    else if(this.setWrapperAsBrand) {
      setTimeout(() => {
        
        let brandsWrapperHeight = this.brandsWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = brandsWrapperHeight + "px";
        this.setWrapperAsBrand = false;
        console.log("setWrapperAsBrand")

      }, 50);
    }
    else if(this.setWrapperAsPromotion) {
      setTimeout(() => {
        
        let promotionWrapperHeight = this.promotionsWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = promotionWrapperHeight + "px";
        this.setWrapperAsPromotion = false;
        console.log("setWrapperAsPromotion")
        
      }, 50);
    }
    else if(this.setWrapperAsStaticPage) {
      setTimeout(() => {
        
        let WrapperHeight = this.staticPagesWrapper.nativeElement.clientHeight;
        this.selector.nativeElement.style.height = WrapperHeight + "px";
        this.setWrapperAsStaticPage = false;
        console.log("setWrapperAsStaticPage")

      }, 50);
    }
  }

}
