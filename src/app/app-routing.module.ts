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


const routes: Routes = [
  {path: URLS.signin, component: SigninComponent},
  {path: URLS.forgotPassword, component: ForgotPasswordComponent},
  {path: URLS.acceptInvite + '/:key', component: AcceptInviteComponent},
  {path: URLS.home, component: DashboardComponent},
  {path: URLS.configuration, component: ConfigurationComponent},
  {path: URLS.userManagement, children: [
    {path: '', redirectTo: 'all', pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent},
    {path: URLS.add, component: AddUserComponent},
    {path: URLS.info + '/:id', component: UserInfoComponent},
  ]},
  {path: URLS.tax, component: TaxConfigurationComponent},
  {path: URLS.generalInformation, component: GeneralInformationComponent},
  {path: URLS.categories, component: CategoryStructureComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
