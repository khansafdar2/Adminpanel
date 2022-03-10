import { CheckoutCustomizationComponent } from './views/configuration/checkout-customization/checkout-customization.component';
import { CitiesComponent } from './views/configuration/shipping-regions/countries/cities/cities.component';
import { ShippingRegionsComponent } from './views/configuration/shipping-regions/shipping-regions.component';
import { FooterCustomizationComponent } from './views/cms/footer-customization/footer-customization.component';
import { HeaderCustomizationComponent } from './views/cms/customization-header/customization-header.component';
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
import { ApprovalGuard, BrandsGuard, CategoryStructureGuard, CheckoutSettingGuard, ConfigurationGuard, CouponGuard, CustomersGuard, CustomizationGuard, DashboardGuard, DiscountsGuard, FilterGuard, FooterPagesGuard, HeaderPagesGuard, HomePageGuard, LoyaltyGuard, MainDiscountGuard, NavigationGuard, OrdersGuard, ProductCollectiontGuard, ProductGrouptGuard, ProductListGuard, ProductsGuard, ShippingMethodsGuard, ShippingRegionGuard, StaticPagesGuard, StoreSettingGuard, UserManagementGuard, VendorGuard} from './auth/permission.guard';
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
import { PagesComponent } from './views/cms/pages/pages.component';
import { AddPageComponent } from './views/cms/pages/add-page/add-page.component';
import { EditPageComponent } from './views/cms/pages/edit-page/edit-page.component';
import { HomepageComponent } from './views/cms/homepage/homepage.component';
import { VendorsComponent } from './views/vendors/vendors.component';
import { AddVendorComponent } from './views/vendors/add-vendor/add-vendor.component';
import { EditVendorComponent } from './views/vendors/edit-vendor/edit-vendor.component';
import { NavigationsComponent } from './views/cms/navigations/navigations.component';
import { AddNavigationComponent } from './views/cms/navigations/add-navigation/add-navigation.component';
import { EditNavigationComponent } from './views/cms/navigations/edit-navigation/edit-navigation.component';
import { ShippingZoneComponent } from './views/configuration/shipping/zones/shipping-zone/shipping-zone.component';
import { ShippingRatesComponent } from './views/configuration/shipping/shipping-rates/shipping-rates.component';
import { AddShippingRatesComponent } from './views/configuration/shipping/shipping-rates/add-shippping-rate/add-shipping-rate.component';
import { DefaultShippingComponent } from './views/configuration/shipping/default-shipping/default-shipping.component';
import { FiltersComponent } from './views/cms/filters/filters/filters.component';
import { AddChildOrderComponent } from './views/orders/add-child-order/add-child-order.component';
import { EditCouponComponent } from './views/discounts/coupons/edit-coupon/edit-coupon.component';
import { AddCouponComponent } from './views/discounts/coupons/add-coupon/add-coupon.component';
import { CouponsComponent } from './views/discounts/coupons/coupons.component';
import { LoyalityComponent } from './views/configuration/loyality/loyality.component';
import { CountriesComponent } from './views/configuration/shipping-regions/countries/countries.component';
import { ContentApprovalComponent } from './views/content-approval/content-approval.component';
import { FeaturedAppsComponent } from './featured-apps/featured-apps.component';


const routes: Routes = [
  {path: '', redirectTo: URLS.signin, pathMatch: 'full'},
  {path: URLS.signin, component: SigninComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.forgotPassword, component: ForgotPasswordComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.acceptInvite + '/:key', component: AcceptInviteComponent, canActivate: [LoggedOutAuthGuard]},
  {path: URLS.home, component: DashboardComponent, canActivate: [LoggedInAuthGuard, DashboardGuard]},
  {path: URLS.configuration, component: ConfigurationComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.userManagement, canActivate:[LoggedInAuthGuard, ConfigurationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent, canActivate:[UserManagementGuard]},
    {path: URLS.add, component: AddUserComponent, canActivate:[UserManagementGuard]},
    {path: URLS.info + '/:id', component: UserInfoComponent, canActivate:[UserManagementGuard]},
  ]},
  {path: URLS.tax, component: TaxConfigurationComponent, canActivate: [LoggedInAuthGuard, ConfigurationGuard]},
  {path: URLS.generalInformation, component: GeneralInformationComponent, canActivate: [LoggedInAuthGuard, StoreSettingGuard]},
  {path: URLS.shipping, component: ShippingComponent, canActivate: [LoggedInAuthGuard ,ShippingMethodsGuard]},
  {path: URLS.loyality, component: LoyalityComponent, canActivate: [LoggedInAuthGuard, LoyaltyGuard, VendorGuard]},
  {path: URLS.categories, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CategoryStructureComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.newMainCategory, component: NewMainCategoryComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.newSubCategory + '/:mainID', component: NewSubCategoryComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.editMainCategory + '/:id', component: EditMainCategoryComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.editSubCategory + '/:id', component: EditSubCategoryComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.newSuperSubCategory + '/:subID', component: NewSuperSubCategoryComponent, canActivate: [CategoryStructureGuard]},
    {path: URLS.editSuperSubCategory + '/:id', component: EditSuperSubCategoryComponent, canActivate: [CategoryStructureGuard]},
  ]},
  {path: URLS.collections, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CollectionsComponent, canActivate: [ProductCollectiontGuard]},
    {path: URLS.add, component: AddCollectionComponent, canActivate: [ProductCollectiontGuard] },
    {path: URLS.edit + '/:id', component: EditCollectionComponent, canActivate: [ProductCollectiontGuard]}
  ]},
  {path: URLS.products, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductsComponent, canActivate: [ProductListGuard]},
    {path: URLS.add, component: AddProductComponent , canActivate: [ProductListGuard]},
    {path: URLS.edit + '/:id', component: EditProductComponent , canActivate: [ProductListGuard]},
    {path: ':productID/' + URLS.variants, canActivate: [ProductListGuard], children: [
      {path: URLS.add, component: AddVariantComponent},
      {path: ':id', component: EditVariantComponent}
    ]}
  ]},
  {path: URLS.productGroups, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ProductGroupsComponent,canActivate: [ProductGrouptGuard]},
    {path: URLS.add, component: AddProductGroupComponent,canActivate: [ProductGrouptGuard]},
    {path: URLS.edit + '/:id', component: EditProductGroupComponent,canActivate: [ProductGrouptGuard]}
  ]},
  {path: URLS.brands, canActivate: [LoggedInAuthGuard, ProductsGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: BrandsComponent, canActivate: [BrandsGuard]},
    {path: URLS.add, component: AddBrandComponent, canActivate: [BrandsGuard]},
    {path: URLS.edit + '/:id', component: EditBrandComponent, canActivate: [BrandsGuard]}
  ]},
  {path: URLS.discounts, canActivate: [LoggedInAuthGuard, DiscountsGuard, MainDiscountGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: DiscountsComponent, canActivate: [MainDiscountGuard]},
    {path: URLS.add, component: AddDiscountComponent, canActivate: [MainDiscountGuard]},
    {path: URLS.edit + '/:id', component: EditDiscountComponent, canActivate: [MainDiscountGuard]}
  ]},
  {path: URLS.coupons, canActivate: [LoggedInAuthGuard, DiscountsGuard, CouponGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: CouponsComponent, canActivate: [CouponGuard,VendorGuard ]},
    {path: URLS.add, component: AddCouponComponent, canActivate: [CouponGuard, VendorGuard]},
    {path: URLS.edit + '/:id', component: EditCouponComponent, canActivate: [VendorGuard]}
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
    {path: URLS.addChildOrder + '/:mainID', component: AddChildOrderComponent},
    {path: URLS.editMainOrder + '/:id', component: EditMainOrderComponent},
    {path: URLS.editChildOrder + '/:id', component: EditChildOrderComponent}
  ]},
  {path: URLS.draftOrders, canActivate: [LoggedInAuthGuard, OrdersGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: DraftOrdersComponent},
    {path: URLS.edit + '/:id', component: EditDraftOrderComponent}
  ]},
  {path: URLS.pages, canActivate: [LoggedInAuthGuard, CustomizationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: PagesComponent, canActivate: [StaticPagesGuard]},
    {path: URLS.add, component: AddPageComponent, canActivate: [StaticPagesGuard]},
    {path: URLS.edit + '/:id', component: EditPageComponent, canActivate: [StaticPagesGuard]},
  ]},
  {path: URLS.headerCustomization, component: HeaderCustomizationComponent,  canActivate: [LoggedInAuthGuard, HeaderPagesGuard]},
  {path: URLS.footerCustomization, component: FooterCustomizationComponent,  canActivate: [LoggedInAuthGuard, FooterPagesGuard]},
  {path: URLS.homepage, canActivate: [LoggedInAuthGuard, HomePageGuard], component: HomepageComponent},
  {path: URLS.navigations, canActivate: [LoggedInAuthGuard, CustomizationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: NavigationsComponent, canActivate: [NavigationGuard, VendorGuard]},
    {path: URLS.add, component: AddNavigationComponent, canActivate: [NavigationGuard, VendorGuard]},
    {path: URLS.edit + '/:id', component: EditNavigationComponent, canActivate: [NavigationGuard, VendorGuard]}
  ]},
  {path: URLS.vendors, canActivate: [LoggedInAuthGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: VendorsComponent, canActivate: [VendorGuard]},
    {path: URLS.add, component: AddVendorComponent, canActivate: [VendorGuard]},
    {path: URLS.edit + '/:id', component: EditVendorComponent, canActivate: [VendorGuard]},
  ]},
  {path: URLS.contentApproval, canActivate: [LoggedInAuthGuard, ApprovalGuard], component: ContentApprovalComponent},
  {path: URLS.zones, canActivate: [LoggedInAuthGuard, ConfigurationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ShippingZoneComponent, canActivate: [ShippingMethodsGuard]},
  ]},
  {path: URLS.shippingRates, canActivate: [LoggedInAuthGuard, ConfigurationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: ShippingRatesComponent, canActivate: [ShippingMethodsGuard]},
    {path: URLS.add, component: AddShippingRatesComponent, canActivate: [ShippingMethodsGuard]},
    {path: URLS.edit + '/:id', component: AddShippingRatesComponent, canActivate: [ShippingMethodsGuard]}
  ]},
  {path: URLS.defaultShipping, canActivate: [LoggedInAuthGuard, ConfigurationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.add, component: DefaultShippingComponent, canActivate: [ShippingMethodsGuard]},
    {path: URLS.edit + '/:id', component: DefaultShippingComponent, canActivate: [ShippingMethodsGuard]}
  ]},
  {path: URLS.filters, canActivate: [LoggedInAuthGuard, CustomizationGuard], children: [
    {path: '', redirectTo: URLS.all, pathMatch: 'full'},
    {path: URLS.all, component: FiltersComponent, canActivate: [VendorGuard,FilterGuard]}
  ]},
  {path: URLS.shippingRegions, component: ShippingRegionsComponent,  canActivate: [LoggedInAuthGuard, ShippingRegionGuard, VendorGuard]},
  {path: URLS.country + '/:id', component: CountriesComponent,  canActivate: [LoggedInAuthGuard, ShippingRegionGuard, VendorGuard]},
  {path: URLS.cities + '/:id', component: CitiesComponent,  canActivate: [LoggedInAuthGuard, ShippingRegionGuard, VendorGuard]},
  {path: URLS.checkoutCustomization, component: CheckoutCustomizationComponent,  canActivate: [LoggedInAuthGuard, CheckoutSettingGuard, VendorGuard]},
  {path: URLS.pushNotification,
    loadChildren: () => import('./featured-apps/push-notifications-module/push-notifications-module.module').then(m => m.PushNotificationModuleModule)
  },
  {path: URLS.featuredApps, component: FeaturedAppsComponent, canActivate: [LoggedInAuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
