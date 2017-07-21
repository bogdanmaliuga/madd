import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing }       from './editors.routing';
import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    CKEditorModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule   
  ],
  declarations: [
    Editors,
    Ckeditor
  ]
})
export class EditorsModule {
}
