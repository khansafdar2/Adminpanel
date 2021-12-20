import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';
import { asapScheduler, asyncScheduler } from 'rxjs';

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
  
  navIndexToUpdate : any
  navNodeToUpdate = null
  
  placeholderNavNode : NavigationNode = {title:'New', url:''};

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

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
  }
  addItem(e)
  {
    debugger
  }
  isArray(item: any): boolean {
    return Array.isArray(item);
  }
  editNav(index)
  {
    debugger
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
    let placeholderNode: NavigationNode = {title:'New', url:''};
    this.navigation[index].push(placeholderNode)
    this.updateDropList()
  }
  create3rdLevelNestedSibling(index){
    
    let indexes = index.split(',')
    let subArray = this.navigation[parseInt(indexes[0])]
    let placeholderNode: NavigationNode = {title:'New', url:''};
    subArray[parseInt(indexes[1])].push(placeholderNode)
    this.updateDropList()
  }
  createNestedNavigation(event)
  {
    debugger
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
  
  
}
export interface NavigationNode {
  title: string;
  url : string;
}
