import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import {Router} from '@angular/router';
import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import firebase from 'firebase';
@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <chat-window></chat-window>
        <router-outlet></router-outlet>
      </div>
    </div>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

  constructor(private _menuService: BaMenuService,private router: Router) {
  if(!window.localStorage.getItem('loggedin'))
    { 
    console.log("here");
      this.router.navigate(['login']);
    }
    else
    {
    
      var presenceRef = firebase.database().ref("userData/"+localStorage.getItem('uid'));
      // Write a string when this client loses connection
      presenceRef.onDisconnect().update({online:false});
      firebase.database().ref("userData/"+localStorage.getItem('uid')).update({online:true});
    }
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
