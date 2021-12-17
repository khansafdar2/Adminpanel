import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-edit-navigation-node',
  templateUrl: './edit-navigation-node.component.html',
  styleUrls: ['./edit-navigation-node.component.scss']
})
export class EditNavigationNodeComponent implements OnInit {

  @Input() navIndex: any 
  @Input()  nav: any ;
  @Input() navTitle : string ;
  constructor() {
  }
  
  ngOnInit(): void {
    // this.navTitle = 'ahmad'
  }
  ngOnChanges() : void{
    // this.navTitle = "kaleem"
    this.navTitle = this.nav[this.navIndex]
  }
  changeNavTitle( $event)
  {
    debugger
  }
}
