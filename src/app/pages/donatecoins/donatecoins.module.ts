import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Donatecoins } from './donatecoins.component';
import { routing }       from './donatecoins.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing ],
  declarations: [
    Donatecoins
  ],
   entryComponents: [
        
      ],
})
export class DonatecoinsModule {}
