import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
export interface PromptModel {
  title:string;
  question:string;
}

@Component({
  selector: 'prompt',
  template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()">&times;</button>
                     <h4 class="modal-title">{{title || 'Prompt'}}</h4>
                   </div>
                   <div class="modal-body">
                    <label>{{question}}</label>
                    <textarea placeholder="Write here..." class="form-control" [(ngModel)]="message" name="name" ></textarea><input type="file" (change)="onChange($event)" />
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-success" (click)="apply()">Send</button>
                     <button type="button" class="btn btn-danger" (click)="close()" >Cancel</button>
                   </div>
                 </div>
                </div>`
})
export class PromptComponent extends DialogComponent<PromptModel, {}> implements PromptModel {
  title: string;
  question: string;
  message: string = '';

  file:any;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  apply() {
    this.result = {message:this.message,file:this.file};
    this.close();
  }
  onChange(event) {
    
    console.log(event.srcElement.files[0]);
    if(event.srcElement.files[0])
    {
      
      if(event.srcElement.files[0].size<=15728640)
      {
          this.file = event.srcElement.files;
      }
      else
      {
        alert("File size must be less than 15MB.");
      }
    }
  }
}
