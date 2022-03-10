import { NotificationService } from './../notification.service';
import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.scss']
})
export class EditNotificationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.sendNotificationForm.patchValue({
      id: this.route.snapshot.params.id
    });
  }

  loading: boolean = false;
  imageUrl: string = '';
  URLS = URLS;

  sendNotificationForm = this.fb.group({
    id: null,
    message_image_url: [''],
    message_title: ['', [Validators.required]],
    message_description: ['', [Validators.required]],
    redirect_url: [''],
    is_send: [false]
  });

  onImageChange(url){
    this.imageUrl = url;
    this.sendNotificationForm.patchValue({
      message_image_url: this.imageUrl
    });
  }

  getNotificationDetail() {
    this.loading = true;
    this.notificationService.getNotificationDetail(this.sendNotificationForm.get('id').value).then(resp => {
      this.loading = false;
      if(resp) {
        this.imageUrl = resp.data.message_image_url;
        this.sendNotificationForm.patchValue(resp.data);
      }
    });
  }

  onSubmit(sendNow) {
    this.loading = true;
    let formValue = this.sendNotificationForm.value;
    formValue.is_send = sendNow;
    this.notificationService.updateNotification(formValue).then(resp => {
      this.loading = false;
      if (resp) {
        let snackbarMessage = "Notification saved" + (sendNow ? " and sent." : ".");
        this.snackbarService.open(snackbarMessage, "", { duration: 3000 });
        this.router.navigate(['/', URLS.pushNotification]);
      }
    });
  }

  ngOnInit(): void {
    this.getNotificationDetail();
  }

}
