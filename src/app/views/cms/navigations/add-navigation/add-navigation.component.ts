import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';
import { asapScheduler, asyncScheduler } from 'rxjs';
import {NavigationService} from '../navigation.service'

/**
 * @title Drag&Drop connected sorting group
 */
@Component({
  selector: 'add-navigation',
  templateUrl: './add-navigation.component.html',
  styleUrls: ['./add-navigation.component.scss'],
})
export class AddNavigationComponent {
  loading = false
  navigation : any[] = [];
  navTitle = ''
  
  navIndexToUpdate : any
  navNodeToUpdate = null
  
  placeholderNavNode : NavigationNode = {title:'New', url:''};

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

  constructor(private navigationService: NavigationService) { }

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    setTimeout(() => {
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
                debugger
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
    }, 50)
  }
  addItem(e)
  {
    
  }
  publish(){
    console.log(this.navigation)
    debugger
    let data = {
      title : this.navTitle
    }
    this.navigationService.createNewNavigation(data).then((resp) => {
      console.log(resp)
    })


  }
  isArray(item: any): boolean {
    return Array.isArray(item);
  }
  editNav(index)
  {
    
    this.navIndexToUpdate = index
    console.log('index : '+index)

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
      console.log('found DropList ' + dl.id)
      ldls.push(dl)
    });
    ldls = ldls.reverse()
    asapScheduler.schedule(() => { this.dls = ldls; });
  }

  createNavigation(){
    let placeholderNode: NavigationNode = {title:'New', url:''};
    this.navigation.push(placeholderNode);
    this.updateDropList()
  }
  createSiblingNavigation(index){
    this.navIndexToUpdate  = index
    let placeholderNode: NavigationNode = {title:'New', url:''};
    this.navigation[index].push(placeholderNode)
    this.updateDropList()
  }
  create3rdLevelNestedSibling(index){
    this.navIndexToUpdate  = index
    let indexes = index.split(',')
    let subArray = this.navigation[parseInt(indexes[0])]
    let placeholderNode: NavigationNode = {title:'New', url:''};
    subArray[parseInt(indexes[1])].push(placeholderNode)
    this.updateDropList()
  }
  createNestedNavigation(event)
  {
    this.navIndexToUpdate  = event
    let placeholderNode: NavigationNode = {title:'New', url:''};
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
    debugger
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

  
  
  
}
export interface NavigationNode {
  title: string;
  url : string;
}
