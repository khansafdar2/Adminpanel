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
    private authService: AuthService
  ) { }

  URLS = URLS;
  loading: boolean = false;
  imageUrl: string = '';

  
  sendNotificationForm = this.fb.group({
    image: [''],
    title: ['', [Validators.required]],
    message: ['', [Validators.required]],
    link: ['']
  })



  onImageChange(url){
    this.imageUrl = url;
    this.sendNotificationForm.patchValue({
      logo_image: this.imageUrl
    })
  }

  ngOnInit(): void {
  }

}
