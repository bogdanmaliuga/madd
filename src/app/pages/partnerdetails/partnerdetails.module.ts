import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Partnerdetails } from './partnerdetails.component';
import { routing }       from './partnerdetails.routing';
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
    Partnerdetails
  ],
   entryComponents: [
        
      ],
})
export class PartnerdetailsModule {}
