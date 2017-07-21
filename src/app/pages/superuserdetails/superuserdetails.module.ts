import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Superuserdetails } from './superuserdetails.component';
import { routing }       from './superuserdetails.routing';
import { CarouselModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    CarouselModule.forRoot() ],
  declarations: [
    Superuserdetails
  ],
   entryComponents: [
        
      ],
})
export class SuperuserdetailsModule {}
