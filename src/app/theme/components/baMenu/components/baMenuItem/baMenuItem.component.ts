import {ChangeDetectorRef,Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import 'style-loader!./baMenuItem.scss';

@Component({
  selector: 'ba-menu-item',
  templateUrl: './baMenuItem.html'
})
export class BaMenuItem {
public pendingTasksCount:any;
  @Input() menuItem:any;
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  public onHoverItem($event):void {
    this.itemHover.emit($event);
  }
public ngOnInit(): void {

  var projectAssigned_ref2 = firebase.database().ref('/projectAssigned/').orderByChild('email').equalTo(localStorage.getItem('email'));
                  projectAssigned_ref2.on('value', (snapshot1)=> {
                  this.pendingTasksCount=0;
                  
                         for(var k in snapshot1.val())
                            {
                            console.log(snapshot1.val()[k].status);
                            if(snapshot1.val()[k].status=='pending' && snapshot1.val()[k].type=='task')
                              this.pendingTasksCount=this.pendingTasksCount+1;
                              console.log(this.pendingTasksCount);
        
                            }
                            
                                             
                         
        });

}
  public onToggleSubMenu($event, item):boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }
 
}
