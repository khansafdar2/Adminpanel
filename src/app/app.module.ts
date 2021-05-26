import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

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
import { UserInfoComponent } from './views/configuration/user-management/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    DashboardComponent,
    TopbarComponent,
    SidenavComponent,
    ConfigurationComponent,
    UserManagementComponent,
    TransferOwnershipDialog,
    AddUserComponent,
    UserInfoComponent
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

    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule
  ],
  providers: [LoggedInAuthGuard, LoggedOutAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
