import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

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
    private authService: AuthService
  ) { }

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
