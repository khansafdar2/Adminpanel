import { NotificationService } from './../notification.service';
import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationComponent implements OnInit {

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
    link: ['']
  })



  onImageChange(url){
    this.imageUrl = url;
    this.sendNotificationForm.patchValue({
      message_image_url: this.imageUrl
    })
  }

  onSubmit() {
    this.loading = true;
    this.notificationServcie.createNotification(this.sendNotificationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Notification sent successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.sendNotification]);
      }
    });
  }


  ngOnInit(): void {
  }

}
