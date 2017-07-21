import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AngularFireModule } from 'angularfire2';
import { Pages } from './pages.component';


@NgModule({
  imports: [CommonModule, NgaModule, routing,BrowserModule],
  declarations: [Pages]
})

export class PagesModule {
}
