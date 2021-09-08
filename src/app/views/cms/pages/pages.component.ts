import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { PagesService } from './pages.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(
    private pagesService: PagesService,
    private router: Router
  ) { }

  loading: boolean = true;
  URLS = URLS;
  pages = [];
  displayedColumns: Column[] = [
    {
      title: "",
      selector: 'title',
      clickable: true
    },
    {
      title: "",
      selector: "updated_at",
      pipe: 'date',
      dateFormat: 'MMM d, h:mm a',
      width: "140px"
    }
  ];

  onCellClick(data) {
    this.router.navigate(["/", URLS.pages, URLS.edit, data.row.id]);
  }

  getPages() {
    this.loading = true;
    this.pagesService.getPages().then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.pages = resp.data;
      }
    })
  }

  ngOnInit(): void {
    this.getPages();
  }

}
