import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Profile } from './profile.component';
import { routing }       from './profile.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing ],
  declarations: [
    Profile
  ],
   entryComponents: [
        
      ],
})
export class ProfileModule {}
