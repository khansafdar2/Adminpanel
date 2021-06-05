import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoggedOutAuthGuard, LoggedInAuthGuard } from './auth/auth.guard';
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


const routes: Routes = [
  {path: URLS.signin, component: SigninComponent},
  {path: URLS.forgotPassword, component: ForgotPasswordComponent},
  {path: URLS.acceptInvite + '/:key', component: AcceptInviteComponent},
  {path: URLS.home, component: DashboardComponent},
  {path: URLS.configuration, component: ConfigurationComponent},
  {path: URLS.userManagement, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent},
    {path: URLS.add, component: AddUserComponent},
    {path: URLS.info + '/:id', component: UserInfoComponent},
  ]},
  {path: URLS.tax, component: TaxConfigurationComponent},
  {path: URLS.generalInformation, component: GeneralInformationComponent},
  {path: URLS.categories, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CategoryStructureComponent},
    {path: URLS.newMainCategory, component: NewMainCategoryComponent},
    {path: URLS.newSubCategory + '/:mainID', component: NewSubCategoryComponent},
    {path: URLS.editMainCategory + '/:id', component: EditMainCategoryComponent},
    {path: URLS.editSubCategory + '/:id', component: EditSubCategoryComponent}
  ]},
  {path: URLS.collections, children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CollectionsComponent},
    {path: URLS.add, component: AddCollectionComponent},
    {path: URLS.edit + '/:id', component: EditCollectionComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
