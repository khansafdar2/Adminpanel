import { PushNotificationComponent } from './push-notifications/push-notifications.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {path: '', component:PushNotificationComponent },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SendNotificationRoutingModule { }
