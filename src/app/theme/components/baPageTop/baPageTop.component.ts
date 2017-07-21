import {ChangeDetectorRef,Component} from '@angular/core';

import {GlobalState} from '../../../global.state';

import 'style-loader!./baPageTop.scss';
import { AuthService } from '../../../../providers/auth-service';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public email:any;
  public uid:any;
  public name:any;
  public initialOfName:any;
  public notifications:any;
  public NotificationCounter:any;
  public prifleImage:any;
  constructor(private _state:GlobalState,  public authService: AuthService, private router: Router,private af: AngularFire,private changeDetectorRef: ChangeDetectorRef) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    

    if(localStorage.getItem('email'))
    this.email=localStorage.getItem('email');
    if(localStorage.getItem('uid'))
    this.uid=localStorage.getItem('uid');
    if(localStorage.getItem('name'))
    {
      this.name=localStorage.getItem('name');
      this.initialOfName = this.name.substring(0,2);
    }
    if(localStorage.getItem('picture'))
    this.prifleImage=localStorage.getItem('picture');
    if(this.uid)
    {
    var notifications_ref2 = firebase.database().ref().child('/userData/'+this.uid+'/notifications');    
        

        notifications_ref2.on('value', (notifications)=> {
        this.notifications=[];
        if(notifications.val())
        {
           this.NotificationCounter=0;
            for(var k in notifications.val())
            {
              if(notifications.val()[k].status=="unread")
                this.NotificationCounter=this.NotificationCounter+1;

               var d=notifications.val()[k];
               d.id=k;
               this.notifications.push(d);
               this.changeDetectorRef.detectChanges();

            }
            
          }
        });
        }
  }
  opneNotifications(notification)
  {

    if(notification.status=='unread')
      {

         this.NotificationCounter=this.NotificationCounter-1;
         firebase.database().ref().child('/userData/'+this.uid+'/notifications/'+notification.id).update({status:'read'});
      }

    if(notification.connection_request)
    {
      this.router.navigate(['pages/dashboard']); 
    }
    else if(notification.taskIndex>=0)
    {
      this.router.navigate(['pages/projectdetails/',notification.project]); 
    }
    else if(notification.assignedTaskIndex>=0)
    {
      this.router.navigate(['pages/charts']); 
    }
    else
    {
      
    }
  }
  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

    logout() {
    this.authService.doLogout();
    localStorage.removeItem('loggedin');
     this.router.navigate(['/login']);
  }
}
