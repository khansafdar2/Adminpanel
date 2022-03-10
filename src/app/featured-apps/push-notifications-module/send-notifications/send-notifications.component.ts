import { NotificationService } from './../notification.service';
import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-send-notifications',
  templateUrl: './send-notifications.component.html',
  styleUrls: ['./send-notifications.component.scss']
})
export class SendNotificationsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationServcie: NotificationService
  ) { }

  loading: boolean = false;
  imageUrl: string = '';
  URLS = URLS;

  
  sendNotificationForm = this.fb.group({
    message_image_url: [''],
    message_title: ['', [Validators.required]],
    message_description: ['', [Validators.required]],
    redirect_url: [''],
    is_send: [false]
  })



  onImageChange(url){
    this.imageUrl = url;
    this.sendNotificationForm.patchValue({
      message_image_url: this.imageUrl
    })
  }

  onSubmit(sendNow) {
    this.loading = true;
    let formValue = this.sendNotificationForm.value;
    formValue.is_send = sendNow;
    this.notificationServcie.createNotification(formValue).then(resp => {
      this.loading = false;
      if (resp) {
        let snackbarMessage = "Notification saved" + (sendNow ? " and sent." : ".");
        this.snackbarService.open(snackbarMessage, "", { duration: 3000 });
        this.router.navigate(['/', URLS.pushNotification]);
      }
    });
  }

  ngOnInit(): void {
  }

}
