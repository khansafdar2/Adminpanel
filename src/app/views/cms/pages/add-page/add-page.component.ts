import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { PagesService } from '../pages.service';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  pageForm = this.fb.group({
      title: ["", [Validators.required]],
      content: [""],
      publish_status: true
  });

  onSubmit() {
    this.loading = true;
    this.pagesService.createPage(this.pageForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Page created.", "", {duration: 3000});
        this.router.navigate(["/", URLS.pages]);
      }
    });
  }

  ngOnInit(): void {
  }

}
