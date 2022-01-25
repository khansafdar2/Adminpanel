import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { AngularFileUploaderModule } from "angular-file-uploader";

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoggedInAuthGuard, LoggedOutAuthGuard } from './auth/auth.guard';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { TransferOwnershipDialog, UserManagementComponent } from './views/configuration/user-management/user-management.component';
import { AddUserComponent } from './views/configuration/user-management/add-user/add-user.component';
import { ChangePasswordDialog, UserInfoComponent, RemoveUserDialog} from './views/configuration/user-management/user-info/user-info.component';
import { AcceptInviteComponent } from './auth/accept-invite/accept-invite.component';
import { TaxConfigurationComponent } from './views/configuration/tax-configuration/tax-configuration.component';
import { GeneralInformationComponent } from './views/configuration/general-information/general-information.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ImportProductsDialog, ProductsChangeApprovalDialog, ProductsChangeStatusDialog, ProductsComponent, AddBulkTagsDialog, ProductsBulkOrganizeDialog, ProductsBulkDeleteDialog, ProductsExportDialog } from './views/products/products.component';
import { CategoryStructureComponent } from './views/products/category-structure/category-structure.component';
import { NewMainCategoryComponent } from './views/products/category-structure/main-category/new-main-category/new-main-category.component';
import { NewSubCategoryComponent } from './views/products/category-structure/sub-category/new-sub-category/new-sub-category.component';
import { EditMainCategoryComponent } from './views/products/category-structure/main-category/edit-main-category/edit-main-category.component';
import { EditSubCategoryComponent } from './views/products/category-structure/sub-category/edit-sub-category/edit-sub-category.component';
import { CollectionDeleteDialog, CollectionsChangeApprovalStatusDialog, CollectionsChangeStatusDialog, CollectionsComponent } from './views/products/collections/collections.component';
import { AddCollectionComponent } from './views/products/collections/add-collection/add-collection.component';
import { EditCollectionComponent } from './views/products/collections/edit-collection/edit-collection.component';
import { DatatableComponent } from './shared/datatable/datatable.component';
import { AddProductComponent, VideoPreviewDialog } from './views/products/add-product/add-product.component';
import { DeleteProductGroupDialog, ProductGroupsComponent } from './views/products/product-groups/product-groups.component';
import { AddProductGroupComponent } from './views/products/product-groups/add-product-group/add-product-group.component';
import { EditProductGroupComponent } from './views/products/product-groups/edit-product-group/edit-product-group.component';
import { NewSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/new-super-sub-category/new-super-sub-category.component';
import { EditSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/edit-super-sub-category/edit-super-sub-category.component';
import { TagsInputComponent } from './shared/tags-input/tags-input.component';
import { DeleteVariantConfirmDialog, EditProductComponent, EditProductOptionsDialog } from './views/products/edit-product/edit-product.component';
import { BrandDeleteDialog, BrandsComponent } from './views/products/brands/brands.component';
import { AddBrandComponent } from './views/products/brands/add-brand/add-brand.component';
import { EditBrandComponent } from './views/products/brands/edit-brand/edit-brand.component';
import { DiscountsComponent, DiscountDeleteDialog } from './views/discounts/discounts.component';
import { EditVariantComponent } from './views/products/edit-variant/edit-variant.component';
import { AddVariantComponent } from './views/products/add-variant/add-variant.component';
import { AddDiscountComponent } from './views/discounts/add-discount/add-discount.component';
import { EditDiscountComponent } from './views/discounts/edit-discount/edit-discount.component';
import { AddShippingDialog, DeleteShippingDialog, EditShippingDialog, ShippingComponent } from './views/configuration/shipping/shipping.component';
import { OrdersComponent, OrdersExportDialog } from './views/orders/orders.component';
import { AddOrderComponent } from './views/orders/add-order/add-order.component';
import { CustomerDeleteDialog, CustomersComponent } from './views/customers/customers.component';
import { AddCustomerComponent } from './views/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './views/customers/edit-customer/edit-customer.component';
import { VariantSelectorComponent, VariantSelectorDialog } from './shared/variant-selector/variant-selector.component';
import { EditMainOrderComponent } from './views/orders/edit-main-order/edit-main-order.component';
import { CustomerAddressDialog } from './views/orders/dialogs/CustomerAddressDialog';
import { PaymentMethodDialog } from './views/orders/dialogs/PaymentMethodDialog';
import { DraftOrdersComponent } from './views/orders/draft-orders/draft-orders.component';
import { EditChildOrderComponent } from './views/orders/edit-child-order/edit-child-order.component';
import { EditDraftOrderComponent } from './views/orders/edit-draft-order/edit-draft-order.component';
import { PageDeleteDialog, PagesComponent } from './views/cms/pages/pages.component';
import { AddPageComponent } from './views/cms/pages/add-page/add-page.component';
import { EditPageComponent } from './views/cms/pages/edit-page/edit-page.component';
import { HomepageComponent, HomepageAddSectionDialog } from './views/cms/homepage/homepage.component';
import { VendorsComponent, DeleteVendorDialog } from './views/vendors/vendors.component';
import { AddVendorComponent } from './views/vendors/add-vendor/add-vendor.component';
import { DeleteCommissionDialog, EditVendorComponent } from './views/vendors/edit-vendor/edit-vendor.component';
import { NavigationsComponent } from './views/cms/navigations/navigations.component';
import { HomepageSliderSection, HomepageCategoriesCarousel, HomepageBrands, HomepageProductsCarousel, HomepageSingleBanner, HomepageCategoriesTabs, HomepageTwoBanners, HomepageFeatureIcons } from './views/cms/homepage/homepage-sections.components';
import { ImageSelectorComponent } from './shared/image-selector/image-selector.component';
import { CategorySelectorComponent } from './shared/category-selector/category-selector.component';
import { CategorySelectorDialogComponent } from './shared/category-selector-dialog/category-selector-dialog.component';
import { HeaderCustomizationComponent } from './views/cms/customization-header/customization-header.component';
import { FooterCustomizationComponent } from './views/cms/footer-customization/footer-customization.component';
import { ProductSelectorComponent, ProductSelectorDialog } from './shared/product-selector/product-selector.component';
import { LoyalityComponent } from './views/configuration/loyality/loyality.component';
import { CouponsComponent, CouponDeleteDialog } from './views/discounts/coupons/coupons.component';
import { AddCouponComponent } from './views/discounts/coupons/add-coupon/add-coupon.component';
import { EditCouponComponent } from './views/discounts/coupons/edit-coupon/edit-coupon.component';


@NgModule({
  declarations: [
    AppComponent,
    DatatableComponent,
    SigninComponent,
    DashboardComponent,
    TopbarComponent,
    SidenavComponent,
    ConfigurationComponent,
    UserManagementComponent,
    TransferOwnershipDialog,
    AddUserComponent,
    UserInfoComponent,
    AcceptInviteComponent,
    TaxConfigurationComponent,
    GeneralInformationComponent,
    ChangePasswordDialog,
    PageDeleteDialog,
    RemoveUserDialog,
    ForgotPasswordComponent,
    ProductsComponent,
    CategoryStructureComponent,
    NewMainCategoryComponent,
    NewSubCategoryComponent,
    EditMainCategoryComponent,
    EditSubCategoryComponent,
    CollectionsComponent,
    AddCollectionComponent,
    EditCollectionComponent,
    ImportProductsDialog,
    ProductsChangeStatusDialog,
    ProductsChangeApprovalDialog,
    AddBulkTagsDialog,
    ProductsBulkOrganizeDialog,
    ProductsBulkDeleteDialog,
    AddProductComponent,
    ProductGroupsComponent,
    AddProductGroupComponent,
    EditProductGroupComponent,
    CollectionsChangeStatusDialog,
    CollectionsChangeApprovalStatusDialog,
    CollectionDeleteDialog,
    NewSuperSubCategoryComponent,
    EditSuperSubCategoryComponent,
    TagsInputComponent,
    EditProductComponent,
    DeleteVariantConfirmDialog,
    EditProductOptionsDialog,
    BrandsComponent,
    AddBrandComponent,
    EditBrandComponent,
    DeleteProductGroupDialog,
    DiscountsComponent,
    EditVariantComponent,
    AddVariantComponent,
    AddDiscountComponent,
    EditDiscountComponent,
    ShippingComponent,
    AddShippingDialog,
    EditShippingDialog,
    DeleteShippingDialog,
    BrandDeleteDialog,
    OrdersComponent,
    AddOrderComponent,
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomerDeleteDialog,
    VariantSelectorComponent,
    VariantSelectorDialog,
    EditMainOrderComponent,
    CustomerAddressDialog,
    PaymentMethodDialog,
    DraftOrdersComponent,
    EditChildOrderComponent,
    EditDraftOrderComponent,
    ProductsExportDialog,
    OrdersExportDialog,
    PagesComponent,
    AddPageComponent,
    EditPageComponent,
    HomepageComponent,
    VendorsComponent,
    AddVendorComponent,
    EditVendorComponent,
    DeleteVendorDialog,
    VideoPreviewDialog,
    NavigationsComponent,
    HomepageSliderSection,
    DiscountDeleteDialog,
    ImageSelectorComponent,
    HomepageCategoriesCarousel,
    HomepageBrands,
    CategorySelectorComponent,
    HomepageProductsCarousel,
    HomepageSingleBanner,
    HomepageCategoriesTabs,
    CategorySelectorDialogComponent,
    HomepageTwoBanners,
    HomepageFeatureIcons,
    HomepageAddSectionDialog,
    HeaderCustomizationComponent,
    FooterCustomizationComponent,
    DeleteCommissionDialog,
    ProductSelectorComponent,
    ProductSelectorDialog,
    LoyalityComponent,
    CouponsComponent,
    AddCouponComponent,
    EditCouponComponent,
    CouponDeleteDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule,
    QuillModule.forRoot(),
    AngularFileUploaderModule,

    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    MatMenuModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
    DragDropModule,
    NgxDropzoneModule
  ],
  providers: [LoggedInAuthGuard, LoggedOutAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
