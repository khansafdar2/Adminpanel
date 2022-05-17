import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { PreferencesService } from './preferences.service';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private preferencesService: PreferencesService,
    private snackbar: MatSnackBar,
  ) {}

  URLS = URLS;
  loading: boolean = false;
  sendPreferencesForm = this.fb.group({
    title: ['',[Validators.required]],
    password: [''],
    enable_password: [false],
    description: [''],
    seo_keywords: [''],
  });



  onEnablePasswordChange() {
    let passwordCheck = this.sendPreferencesForm.get('enable_password').value;
    if (passwordCheck == true) {
      (this.sendPreferencesForm.controls['password'] as FormControl).setValidators([Validators.required]);
      (this.sendPreferencesForm.controls['password'] as FormControl).updateValueAndValidity();
    } else {
      (this.sendPreferencesForm.controls['password'] as FormControl).clearValidators();
      (this.sendPreferencesForm.controls['password'] as FormControl).updateValueAndValidity();
    }
  }

  onSubmit() {
    this.loading = true;
    let mainObj;
    let passwordCheck = this.sendPreferencesForm.get('enable_password').value;
    mainObj = this.sendPreferencesForm.value;
    if (passwordCheck == false) {
      mainObj.password = '';
    }
    this.preferencesService.getPreferencesSetting(mainObj).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Preferences created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.configuration]);
      }
    });
  }

  getCacheSettingDetail() {
    this.loading = true;
    this.preferencesService.getPreferencesDetail().then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data)
        this.sendPreferencesForm.patchValue(resp.data);
      }
    });
  }

  ngOnInit(): void {
    this.getCacheSettingDetail();
  }
}
