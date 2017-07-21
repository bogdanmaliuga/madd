import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { ProjectDetails } from './projectdetails.component';
import { routing }       from './projectdetails.routing';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { PromptComponent } from "../prompt.component";
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    BootstrapModalModule,
    Ng2SmartTableModule
  ],
  declarations: [
    ProjectDetails,
    PromptComponent
  ],
   entryComponents: [
        PromptComponent
      ],
})
export class ProjectDetailsModule {}
