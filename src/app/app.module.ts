import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoggedInAuthGuard, LoggedOutAuthGuard } from './auth/auth.guard';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    DashboardComponent,
    TopbarComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [LoggedInAuthGuard, LoggedOutAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
