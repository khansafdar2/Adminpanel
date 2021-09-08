import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { PagesService } from '../pages.service';


@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pageID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  pageID: string = "";
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  pageForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required]],
    content: [""],
    publish_status: true
  });

  getPageDetails() {
    this.loading = true;
    this.pagesService.getPage(this.pageID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.pageForm.patchValue(resp.data);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.pagesService.updatePage(this.pageForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Page updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.pages]);
      }
    });
  }

  ngOnInit(): void {
    this.getPageDetails();
  }

}
