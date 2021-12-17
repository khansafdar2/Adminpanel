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
  // todo = [
  //   'Get to work',
  //   [
  //     'Get up',
  //     'Brush teeth',
  //     'Take a shower',
  //     'Check e-mail',
  //     'Walk dog',
  //     'Walk dog 123',
  //     [
  //       'Walk dog 123'
  //     ]
      
  //   ],
  //   [
  //     'Preare for work',
  //     'Drive to office',
  //     'Üark car'
  //   ],
  //   'Pick up groceries',
  //   'Go home',
  //   'Fall asleep'
  // ];
  todo : any[] = [
    {title:"ahmad", url:"www.google.com"}
  ];
  navIndexToUpdate : any


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

  isArray(item: any): boolean {
    return Array.isArray(item);
  }
  editNav(index)
  {
    this.navIndexToUpdate = index
    console.log('index : '+index)
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
    this.todo.push({title:'New', url:''})
    this.updateDropList()
  }
  createSiblingNavigation(index){
    this.todo[index].push({title:'New', url:''})
    this.updateDropList()
  }
  create3rdLevelNestedSibling(index){
    let indexes = index.split(',')
    let subArray = this.todo[indexes[0]]
    subArray[indexes[1]].push({title:'New', url:''})
    this.updateDropList()
  }
  createNestedNavigation(event)
  {
    let index = event
    if (typeof(index) != 'number' )
    {
      let indexes = index.split(',')
      let subArray = this.todo[indexes[0]]
      subArray.splice(indexes[1] + 1, 0, [{title:'New', url:''}])
      
    }
    else{
      this.todo.splice(index + 1, 0, [{title:'New', url:''}]);  
    }
    this.updateDropList()
  }
  
  
}
