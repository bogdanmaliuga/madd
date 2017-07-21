import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Superuser } from './superuser.component';
import { routing }       from './superuser.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing ],
  declarations: [
    Superuser
  ],
   entryComponents: [
        
      ],
})
export class SuperuserModule {}
