import { NotificationsComponent } from './notifications/notifications.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';
import { SendNotificationsComponent } from './send-notifications/send-notifications.component';



const routes: Routes = [
  {path: '', component:NotificationsComponent },
  {path: URLS.sendNotification, component:SendNotificationsComponent },
  {path: URLS.edit + '/:id', component:EditNotificationComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PushNotificationRoutingModule { }
