import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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


import { TableModule } from 'primeng/table';

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
import { ChangePasswordDialog, UserInfoComponent } from './views/configuration/user-management/user-info/user-info.component';
import { AcceptInviteComponent } from './auth/accept-invite/accept-invite.component';
import { TaxConfigurationComponent } from './views/configuration/tax-configuration/tax-configuration.component';
import { GeneralInformationComponent } from './views/configuration/general-information/general-information.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ApplyBulkDiscountDialog, ImportProductsDialog, ProductsChangeApprovalDialog, ProductsChangeStatusDialog, ProductsComponent, AddBulkTagsDialog, ApplyBulkChannelDialog } from './views/products/products.component';
import { CategoryStructureComponent } from './views/products/category-structure/category-structure.component';
import { NewMainCategoryComponent } from './views/products/category-structure/main-category/new-main-category/new-main-category.component';
import { NewSubCategoryComponent } from './views/products/category-structure/sub-category/new-sub-category/new-sub-category.component';
import { EditMainCategoryComponent } from './views/products/category-structure/main-category/edit-main-category/edit-main-category.component';
import { EditSubCategoryComponent } from './views/products/category-structure/sub-category/edit-sub-category/edit-sub-category.component';
import { CollectionDeleteDialog, CollectionsChangeApprovalStatusDialog, CollectionsChangeStatusDialog, CollectionsComponent } from './views/products/collections/collections.component';
import { AddCollectionComponent } from './views/products/collections/add-collection/add-collection.component';
import { EditCollectionComponent } from './views/products/collections/edit-collection/edit-collection.component';
import { DatatableComponent } from './shared/datatable/datatable.component';
import { AddProductComponent } from './views/products/add-product/add-product.component';
import { ProductGroupsComponent } from './views/products/product-groups/product-groups.component';
import { AddProductGroupComponent } from './views/products/product-groups/add-product-group/add-product-group.component';
import { EditProductGroupComponent } from './views/products/product-groups/edit-product-group/edit-product-group.component';
import { NewSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/new-super-sub-category/new-super-sub-category.component';
import { EditSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/edit-super-sub-category/edit-super-sub-category.component';
import { TagsInputComponent } from './shared/tags-input/tags-input.component';
import { DeleteVariantConfirmDialog, EditProductComponent, EditProductOptionsDialog } from './views/products/edit-product/edit-product.component';
import { BrandsComponent } from './views/products/brands/brands.component';

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
    ApplyBulkDiscountDialog,
    AddBulkTagsDialog,
    ApplyBulkChannelDialog,
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
    BrandsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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

    TableModule,
  ],
  providers: [LoggedInAuthGuard, LoggedOutAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
