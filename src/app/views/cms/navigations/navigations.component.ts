// import { Component, OnInit } from '@angular/core';
import { Component, Inject, ViewEncapsulation, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { debounce } from "@agentepsilon/decko";
import { NavigationService } from './navigation.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';


@Component({
  selector: 'app-navigations',
  templateUrl: './navigations.component.html',
  styleUrls: ['./navigations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationsComponent implements OnInit {
  // ids for connected drop lists
  allNavigations: any
  loading: boolean = false;
  URLS = URLS
  
  constructor(@Inject(DOCUMENT) 
  private document: Document,
  private navigationService: NavigationService,
  private router: Router
  ) {
    
  }
  displayedColumns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true,
      width: "35%"
    }
  ]
  ngOnInit(): void {
    this.fetchNavigations()
  }
  fetchNavigations() {
    this.navigationService.getNavigations().then((resp) => {
      this.allNavigations = resp
      console.log('all navigations', this.allNavigations.data)
    })
  }
  onCellClick(data) {
    
    if(data.column === "title") {
      this.router.navigate(["/", URLS.navigations, URLS.edit, data.row.id]);
    }
  }

}



