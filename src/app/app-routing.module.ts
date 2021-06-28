import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { LoggedOutAuthGuard, LoggedInAuthGuard } from './auth/auth.guard';
import { SigninComponent } from './auth/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import URLS from './shared/urls';
import { UserManagementComponent } from './views/configuration/user-management/user-management.component';
import { AddUserComponent } from './views/configuration/user-management/add-user/add-user.component';
import { UserInfoComponent } from './views/configuration/user-management/user-info/user-info.component';
import { AcceptInviteComponent } from './auth/accept-invite/accept-invite.component';
import { TaxConfigurationComponent } from './views/configuration/tax-configuration/tax-configuration.component';
import { GeneralInformationComponent } from './views/configuration/general-information/general-information.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CategoryStructureComponent } from './views/products/category-structure/category-structure.component';
import { NewMainCategoryComponent } from './views/products/category-structure/main-category/new-main-category/new-main-category.component';
import { NewSubCategoryComponent } from './views/products/category-structure/sub-category/new-sub-category/new-sub-category.component';
import { EditMainCategoryComponent } from './views/products/category-structure/main-category/edit-main-category/edit-main-category.component';
import { EditSubCategoryComponent } from './views/products/category-structure/sub-category/edit-sub-category/edit-sub-category.component';
import { CollectionsComponent } from './views/products/collections/collections.component';
import { AddCollectionComponent } from './views/products/collections/add-collection/add-collection.component';
import { EditCollectionComponent } from './views/products/collections/edit-collection/edit-collection.component';
import { ProductsComponent } from './views/products/products.component';
import { AddProductComponent } from './views/products/add-product/add-product.component';
import { ProductGroupsComponent } from './views/products/product-groups/product-groups.component';
import { AddProductGroupComponent } from './views/products/product-groups/add-product-group/add-product-group.component';
import { EditProductGroupComponent } from './views/products/product-groups/edit-product-group/edit-product-group.component';
import { DashboardGuard } from './auth/permission.guard';
import { NewSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/new-super-sub-category/new-super-sub-category.component';
import { EditSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/edit-super-sub-category/edit-super-sub-category.component';


const routes: Routes = [
  {path: '', redirectTo: URLS.signin, pathMatch: 'full'},
  {path: URLS.signin, component: SigninComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.forgotPassword, component: ForgotPasswordComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.acceptInvite + '/:key', component: AcceptInviteComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.home, component: DashboardComponent, canActivate: [LoggedInAuthGuard, DashboardGuard]},
  {path: URLS.configuration, component: ConfigurationComponent, canActivate: [LoggedInAuthGuard]},
  {path: URLS.userManagement, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.add, component: AddUserComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.info + '/:id', component: UserInfoComponent, canActivate: [LoggedInAuthGuard]},
  ]},
  {path: URLS.tax, component: TaxConfigurationComponent, canActivate: [LoggedInAuthGuard]},
  {path: URLS.generalInformation, component: GeneralInformationComponent, canActivate: [LoggedInAuthGuard]},
  {path: URLS.categories, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CategoryStructureComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.newMainCategory, component: NewMainCategoryComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.newSubCategory + '/:mainID', component: NewSubCategoryComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.editMainCategory + '/:id', component: EditMainCategoryComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.editSubCategory + '/:id', component: EditSubCategoryComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.newSuperSubCategory + '/:subID', component: NewSuperSubCategoryComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.editSuperSubCategory + '/:id', component: EditSuperSubCategoryComponent, canActivate: [LoggedInAuthGuard]},
  ]},
  {path: URLS.collections, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CollectionsComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.add, component: AddCollectionComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.edit + '/:id', component: EditCollectionComponent, canActivate: [LoggedInAuthGuard]}
  ]},
  {path: URLS.products, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductsComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.add, component: AddProductComponent, canActivate: [LoggedInAuthGuard]}
  ]},
  {path: URLS.productGroups, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductGroupsComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.add, component: AddProductGroupComponent, canActivate: [LoggedInAuthGuard]},
    {path: URLS.edit + '/:id', component: EditProductGroupComponent, canActivate: [LoggedInAuthGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
