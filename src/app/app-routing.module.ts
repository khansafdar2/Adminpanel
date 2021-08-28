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
import { ConfigurationGuard, CustomersGuard, DashboardGuard, DiscountsGuard, OrdersGuard, ProductsGuard } from './auth/permission.guard';
import { NewSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/new-super-sub-category/new-super-sub-category.component';
import { EditSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/edit-super-sub-category/edit-super-sub-category.component';
import { EditProductComponent } from './views/products/edit-product/edit-product.component';
import { BrandsComponent } from './views/products/brands/brands.component';
import { AddBrandComponent } from './views/products/brands/add-brand/add-brand.component';
import { EditBrandComponent } from './views/products/brands/edit-brand/edit-brand.component';
import { EditVariantComponent } from './views/products/edit-variant/edit-variant.component';
import { AddVariantComponent } from './views/products/add-variant/add-variant.component';
import { DiscountsComponent } from './views/discounts/discounts.component';
import { AddDiscountComponent } from './views/discounts/add-discount/add-discount.component';
import { EditDiscountComponent } from './views/discounts/edit-discount/edit-discount.component';
import { ShippingComponent } from './views/configuration/shipping/shipping.component';
import { OrdersComponent } from './views/orders/orders.component';
import { AddOrderComponent } from './views/orders/add-order/add-order.component';
import { CustomersComponent } from './views/customers/customers.component';
import { AddCustomerComponent } from './views/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './views/customers/edit-customer/edit-customer.component';
import { EditMainOrderComponent } from './views/orders/edit-main-order/edit-main-order.component';
import { DraftOrdersComponent } from './views/orders/draft-orders/draft-orders.component';
import { EditChildOrderComponent } from './views/orders/edit-child-order/edit-child-order.component';
import { EditDraftOrderComponent } from './views/orders/edit-draft-order/edit-draft-order.component';


const routes: Routes = [
  {path: '', redirectTo: URLS.signin, pathMatch: 'full'},
  {path: URLS.signin, component: SigninComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.forgotPassword, component: ForgotPasswordComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.acceptInvite + '/:key', component: AcceptInviteComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.home, component: DashboardComponent, canActivate: [LoggedInAuthGuard, DashboardGuard]},
  {path: URLS.configuration, component: ConfigurationComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.userManagement, canActivate:[LoggedInAuthGuard, ConfigurationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent},
    {path: URLS.add, component: AddUserComponent},
    {path: URLS.info + '/:id', component: UserInfoComponent},
  ]},
  {path: URLS.tax, component: TaxConfigurationComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.generalInformation, component: GeneralInformationComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.shipping, component: ShippingComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.categories, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CategoryStructureComponent},
    {path: URLS.newMainCategory, component: NewMainCategoryComponent},
    {path: URLS.newSubCategory + '/:mainID', component: NewSubCategoryComponent},
    {path: URLS.editMainCategory + '/:id', component: EditMainCategoryComponent},
    {path: URLS.editSubCategory + '/:id', component: EditSubCategoryComponent},
    {path: URLS.newSuperSubCategory + '/:subID', component: NewSuperSubCategoryComponent},
    {path: URLS.editSuperSubCategory + '/:id', component: EditSuperSubCategoryComponent},
  ]},
  {path: URLS.collections, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CollectionsComponent},
    {path: URLS.add, component: AddCollectionComponent},
    {path: URLS.edit + '/:id', component: EditCollectionComponent}
  ]},
  {path: URLS.products, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductsComponent},
    {path: URLS.add, component: AddProductComponent},
    {path: URLS.edit + '/:id', component: EditProductComponent},
    {path: ':productID/' + URLS.variants, children: [
      {path: URLS.add, component: AddVariantComponent},
      {path: ':id', component: EditVariantComponent}
    ]}
  ]},
  {path: URLS.productGroups, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductGroupsComponent},
    {path: URLS.add, component: AddProductGroupComponent},
    {path: URLS.edit + '/:id', component: EditProductGroupComponent}
  ]},
  {path: URLS.brands, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: BrandsComponent},
    {path: URLS.add, component: AddBrandComponent},
    {path: URLS.edit + '/:id', component: EditBrandComponent}
  ]},
  {path: URLS.discounts, canActivate: [LoggedInAuthGuard, DiscountsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: DiscountsComponent},
    {path: URLS.add, component: AddDiscountComponent},
    {path: URLS.edit + '/:id', component: EditDiscountComponent}
  ]},
  {path: URLS.customers, canActivate: [LoggedInAuthGuard, CustomersGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CustomersComponent},
    {path: URLS.add, component: AddCustomerComponent},
    {path: URLS.edit + '/:id', component: EditCustomerComponent}
  ]},
  {path: URLS.orders, canActivate: [LoggedInAuthGuard, OrdersGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: OrdersComponent},
    {path: URLS.add, component: AddOrderComponent},
    {path: URLS.editMainOrder + '/:id', component: EditMainOrderComponent},
    {path: URLS.editChildOrder + '/:id', component: EditChildOrderComponent}
  ]},
  {path: URLS.draftOrders, canActivate: [LoggedInAuthGuard, OrdersGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: DraftOrdersComponent},
    {path: URLS.edit + '/:id', component: EditDraftOrderComponent}
  ]},
  // {path: URLS.pages, canActivate: [LoggedInAuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
