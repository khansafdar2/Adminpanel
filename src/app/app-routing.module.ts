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


const routes: Routes = [
  {path: URLS.signin, component: SigninComponent},
  {path: URLS.home, component: DashboardComponent},
  {path: URLS.configuration, component: ConfigurationComponent},
  {path: URLS.userManagement, children: [
    {path: '', redirectTo: 'all', pathMatch: 'full'},
    {path: URLS.all, component: UserManagementComponent},
    {path: URLS.add, component: AddUserComponent},
    {path: URLS.info + '/:id', component: UserInfoComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
