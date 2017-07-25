import { ChangeDetectorRef,Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import firebase from 'firebase';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { BaMenuService } from '../../services';
import { GlobalState } from '../../../global.state';
import { ChatWindowComponent } from '../../pages/chat-window/chat-window.component';
import 'style-loader!./baMenu.scss';
import { Broadcaster } from '../../../broadcaster';
@Component({
  selector: 'ba-menu',
  templateUrl: './baMenu.html'
})
export class BaMenu {

  @Input() sidebarCollapsed: boolean = false;
  @Input() menuHeight: number;

  @Output() expandMenu = new EventEmitter<any>();
  public sUserDash:boolean=false;
  public AdmPageLink:boolean=false;
  public CoinsPageLink:boolean=false;

  public menuItems: any[];
  protected _menuItemsSub: Subscription;
  public showHoverElem: boolean;
  public hoverElemHeight: number;
  public hoverElemTop: number;
  protected _onRouteChange: Subscription;
  public outOfArea: number = -200;
 public uid:any;
 public email:any;
 private item: FirebaseObjectObservable<any>;
  public connections:any;
  public connectionsOnline:any;
  public connectionsImage:any;
  public chatBadgeCount:any;

  constructor(private _router: Router, private _service: BaMenuService, private _state: GlobalState,private af: AngularFire,private changeDetectorRef: ChangeDetectorRef,private broadcaster: Broadcaster) {
   this.uid=localStorage.getItem('uid');
    this.email= localStorage.getItem('email');
    firebase.database().ref().child('/userData/'+this.uid+'/coins').once('value', (coins_snapshot)=> {
      if(coins_snapshot.val())
       this.CoinsPageLink=true;
       else
       this.CoinsPageLink=false;
    });
    firebase.database().ref().child('/userData/'+this.uid+'/admin').once('value', (admin_snapshot)=> {
      if(admin_snapshot.val()==true)
       this.AdmPageLink=true;
       else
       this.AdmPageLink=false;
    });
    firebase.database().ref().child('/userData/'+this.uid+'/superuser').once('value', (superuser_snapshot)=> {
      if(superuser_snapshot.val()==true)
       this.sUserDash=true;
       else
       this.sUserDash=false;
    });

   let connections_ref = firebase.database().ref().child('/userData/'+this.uid+'/connections');
    connections_ref.on('value', (connections_snapshot)=> {
        this.connections=[];
        this.connectionsOnline=[];
        this.connectionsImage=[];
        if(connections_snapshot)
        {
          //  console.log("connections_snapshot");
          //  console.log(connections_snapshot.val());
           this.chatBadgeCount=[];
           for(let k in connections_snapshot.val())
           {

              let d=connections_snapshot.val()[k];
              d.id=k;
              this.connectionsOnline[k]=false;
              this.af.database.object('/userData/'+k+'/online',{ preserveSnapshot: true }).subscribe(snapshot => {
                this.connectionsOnline[k]=snapshot.val();
                // console.log(snapshot.val())
              });
              this.af.database.object('/userData/'+k+'/picture',{ preserveSnapshot: true }).subscribe(snapshot => {
                this.connectionsImage[k]=snapshot.val();
                // console.log(snapshot.val())
              });


              this.connections.push(d);

              // console.log(this.connections);
              var f_ref=firebase.database().ref().child('/userChatNotificationCounter/'+this.uid+'/'+k);
              f_ref.on('value', (counter)=> {
                this.chatBadgeCount[counter.key]=counter.val();
                // console.log(counter.val());
                // console.log(counter.key);
                // console.log(this.chatBadgeCount[counter.key]);
                // console.log("============");
              });

              this.changeDetectorRef.detectChanges();
           }
        }
        });





  }

  public updateMenu(newMenuItems) {
    this.menuItems = newMenuItems;
    this.selectMenuAndNotify();
  }

  public selectMenuAndNotify(): void {
    if (this.menuItems) {
      this.menuItems = this._service.selectMenuItem(this.menuItems);
      this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
    }
  }

  public ngOnInit(): void {
    this._onRouteChange = this._router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          // on page load we have to wait as event is fired before menu elements are prepared
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });

    this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
  }

  public ngOnDestroy(): void {
    this._onRouteChange.unsubscribe();
    this._menuItemsSub.unsubscribe();
  }

  public hoverItem($event): void {
    this.showHoverElem = true;
    this.hoverElemHeight = $event.currentTarget.clientHeight;
    // TODO: get rid of magic 66 constant
    this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 66;
  }

  openChat(item)
  {
    // console.log(item);
    if(item.status=='accepted')
   this.broadcaster.broadcast('openchat', item.id);
  }
  public toggleSubMenu($event): boolean {
    let submenu = jQuery($event.currentTarget).next();

    if (this.sidebarCollapsed) {
      this.expandMenu.emit(null);
      if (!$event.item.expanded) {
        $event.item.expanded = true;
      }
    } else {
      $event.item.expanded = !$event.item.expanded;
      submenu.slideToggle();
    }

    return false;
  }
}
