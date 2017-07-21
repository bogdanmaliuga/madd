import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Admin } from './admin.component';
import { routing }       from './admin.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing ],
  declarations: [
    Admin
  ],
   entryComponents: [
        
      ],
})
export class AdminModule {}
