import { Component, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop,  CdkDropList, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';
import { asapScheduler } from 'rxjs';
import {NavigationService} from '../navigation.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * @title Drag&Drop connected sorting group
 */

export interface NavigationNode {
  label: string;
  link : string;
}

@Component({
  selector: 'edit-navigation',
  templateUrl: './edit-navigation.component.html',
  styleUrls: ['./edit-navigation.component.scss'],
})
export class EditNavigationComponent {
  constructor(private navigationService: NavigationService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) 
  {
    this.navId = this.route.snapshot.paramMap.get('id');
  }

  loading = false
  navigation : any[] = [];
  navTitle = ''
  navId = null
  navIndexToUpdate : any
  navNodeToUpdate = null
  URLS = URLS
  placeholderNavNode : NavigationNode = {label:'New', link:''};

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;
  public dls: CdkDropList[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    for (let i = 0; i < this.navigation.length; i++) {
      const mainMenu = this.navigation[i];
      if (Array.isArray(mainMenu) )
      {
        if (!mainMenu.length)
        {
          this.navigation.splice(i, 1)
        }
        else
        {
          for (let j = 0; j < mainMenu.length; j++) {
            const subMenu = mainMenu[j];
            if (Array.isArray(subMenu) )
            {
              
              if (!subMenu.length)
              {
                this.navigation[i].splice(j, 1)
              }
              else
              {
                for (let k = 0; k < subMenu.length; k++) {
                  const superSubMenu = subMenu[k];

                  if (Array.isArray(subMenu) )
                  {
                    // if (!superSubMenu.length)
                    // {
                    //   this.navigation[i][j].splice(k, 1)
                    // }
                  }
                  
                }
              }
            } 
          }
        }
      } 
    }
  }

  publish(){
    var nav_json = JSON.parse(JSON.stringify(this.navigation)); 
    for (let i = 0; i < nav_json.length; i++) {
      const main = nav_json[i];
      if (Array.isArray(main))
      {
        for (let j = 0; j < main.length; j++) {
          const child = main[j];
          if (Array.isArray(child))
          {
            let splicedArray = main.splice(j, 1)
            main[j-1].children = splicedArray[0]
          }
        }
        let splicedArray = nav_json.splice(i, 1)
        nav_json[i-1].children = splicedArray[0]
      }
    }
    let data = {
      id : this.navId,
      title : this.navTitle,
      navigation_json : nav_json
    }
    this.loading = true
    this.navigationService.updateSingleNAvigation(data).then((resp) => {
      this.loading = false
      if (resp)
      {
        if(resp.status == 200) {
          this.router.navigate(["/", URLS.navigations]);
          this.snackbarService.open("Navigation Updated Successfully ", "", {duration: 3000});
        }
      }
    })
  }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }

  editNav(index)
  {
    this.navIndexToUpdate = index
    if (typeof(index) != 'number' )
    {
      var count = (index.match(/,/g) || []).length;
      if (count == 1)
      {
        let indexes = index.split(',')
        let subArray = this.navigation[indexes[0]][indexes[1]]
        this.navNodeToUpdate = subArray
      }
      else if (count == 2)
      { 
        let indexes = index.split(',')
        let subArray = this.navigation[indexes[0]][indexes[1]][indexes[2]]
        this.navNodeToUpdate = subArray
      }
    }
    else{
      this.navNodeToUpdate = this.navigation[index];
    }
    this.updateDropList()
  }

  ngAfterViewInit() {
    this.updateDropList()
  }

  updateDropList() {
    let ldls: CdkDropList[] = [];
    this.dlq.forEach((dl) => {
      ldls.push(dl)
    });
    ldls = ldls.reverse()
    asapScheduler.schedule(() => { this.dls = ldls; });
  }

  createNavigation(){
    let placeholderNode: NavigationNode = {label:'New', link:''};
    this.navigation.push(placeholderNode);
    this.updateDropList()
  }

  createSiblingNavigation(index){
    this.navIndexToUpdate  = index
    let placeholderNode: NavigationNode = {label:'New', link:''};
    this.navigation[index].push(placeholderNode)
    this.updateDropList()
  }

  create3rdLevelNestedSibling(index){
    this.navIndexToUpdate  = index
    let indexes = index.split(',')
    let subArray = this.navigation[parseInt(indexes[0])]
    let placeholderNode: NavigationNode = {label:'New', link:''};
    subArray[parseInt(indexes[1])].push(placeholderNode)
    this.updateDropList()
  }

  createNestedNavigation(event)
  {
    this.navIndexToUpdate  = event
    let placeholderNode: NavigationNode = {label:'New', link:''};
    let index = event
    if (typeof(index) != 'number' )
    {
      let indexes = index.split(',')
      let subArray = this.navigation[parseInt(indexes[0])]
      subArray.splice(parseInt(indexes[1]) + 1, 0, [placeholderNode])
      
    }
    else{
      // this.navigation.push(placeholderNode);
      this.navigation.splice(index + 1, 0, [placeholderNode]);
    }
    this.updateDropList()
  }

  deleteNvigation(index)
  {
    
    if (typeof(index) != 'number' )
    {
      let indexes = index.split(',')
      if (indexes.length == 2)
      {
        let subArray = this.navigation[parseInt(indexes[0])]
        subArray.splice(parseInt(indexes[1]) , 1)
        if (subArray.length == 0)
        {
          this.navigation.splice(parseInt(indexes[0]), 1)
        }
      }
      else if((indexes.length == 3))
      {
        let subArray = this.navigation[parseInt(indexes[0])][parseInt(indexes[1])]
        subArray.splice(parseInt(indexes[2]) , 1)
        if (subArray.length == 0)
        {
          let arrayToRemove = this.navigation[parseInt(indexes[0])]
          arrayToRemove.splice(parseInt(indexes[1]), 1)
        }
      }

      
    }
    else{
      this.navigation.splice(index, 1);
    }
    this.navNodeToUpdate = null
  }

  createNavDragDropFormate(nav)
  {
    
    for (let i = 0; i < nav.length; i++) {
      const main = nav[i];
      if (main.children)
      {
        if (main.children.length)
        {
          for (let j = 0; j < main.children.length; j++) {
            const child = main.children[j];
            if (child.children)
            {
              if (child.children.length)
              {
                main.children.splice(j + 1, 0 , child.children)
                child.children = null
              }
            }
          }
          nav.splice(i + 1, 0 , main.children)
            main.children = null
        }
      }
    }
    this.navigation = nav
  }

  ngOnInit () : void {
    this.loading = true;
    this.navigationService.getSingleNAvigation(this.navId).then((res) => {
      this.loading = false;
      if (res)
      {
        this.navTitle = res.data.title
        this.createNavDragDropFormate(res.data.navigation_json)
      }
    })
  }
}
