import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import 'style-loader!../login/login.scss';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Directive, Input } from '@angular/core';


@Component({
  selector: 'maps',
  templateUrl: './chart.html'
})

export class Charts {


  public form:FormGroup;
  public restaurante:AbstractControl;
  public submitted:boolean = false;
  public email:any;
  item:any;
  allmytask:any = [];
  projects:any=[];
  public type:any;
  pending:any=[];
  accepted:any=[];
  rejected:any=[];
  inprogress:any=[];
  completed:any=[];
  public uid:any;
   constructor(fb:FormBuilder, private router: Router) {
   if(!window.localStorage.getItem('loggedin'))
        {

          this.router.navigate(['login']);
        }

                this.type="all";
                this.email= localStorage.getItem('email');
                this.uid= localStorage.getItem('uid');
                var projectAssigned_ref2 = firebase.database().ref('/projectAssigned/').orderByChild('email').equalTo(this.email);
                  projectAssigned_ref2.on('value', (snapshot1)=> {
                           this.allmytask=[];
                          //  console.log(this.allmytask);
                          //  console.log(snapshot1.val());
                         for(var k in snapshot1.val())
                            {
                            if(snapshot1.val()[k].type=='task')
                            {
                              var d=snapshot1.val()[k];
                              d.id=k;
                               this.allmytask.push(d);
                            }

                            }



                        });

	}

    getProject(callback,task)
        {

                var get_users_ref = firebase.database().ref("/projectData/"+task.projectId);
                 get_users_ref.once("value", (user)=> {
                   var d=user.val();

                   d['task']=task;
                     callback(d);
                 });
        }

togglebtn(type){

  // console.log(type);
  if(type=='all'){
    this.type="all";
  }
   if(type=='pending'){
     this.type="pending";

  }
   if(type=='accepted'){
     this.type="accepted";
  }
   if(type=='rejected'){
     this.type="rejected";
  }
   if(type=='inprogress'){
     this.type="inprogress";
  }
   if(type=='completed'){
     this.type="completed";
  }

}
  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
    }
  }
  accept(task)
  {
    // console.log(task);
    firebase.database().ref('projectAssigned/'+task.id).update({status:'accepted',requesterId:this.uid, acceptedOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+task.projectId+'/tasks/'+task.taskIndex).update({status:'accepted',userid:this.uid,acceptedOn:firebase.database.ServerValue.TIMESTAMP});
    task.status='accepted';
    task.acceptedOn=firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref('userData/'+this.uid+'/acceptedTasks').push(task);

    firebase.database().ref('projectData/'+task.projectId+'/notifications').push({text:this.email+" accepted the task '"+task.taskName+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});

    firebase.database().ref('/userData/'+this.uid).update({projectsAndTasks:'true'});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/').once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
        {
            if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
             firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({status:'unread',text:this.email+" accepted the task '"+task.taskName+"' of project '"+task.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
        }
     });


  }
  reject(task)
  {
      firebase.database().ref('projectAssigned/'+task.id).update({status:'rejected',rejectedOn:firebase.database.ServerValue.TIMESTAMP});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/'+task.taskIndex).update({status:'rejected',rejectedOn:firebase.database.ServerValue.TIMESTAMP});

     firebase.database().ref('userData/'+task.ownerId+'/notifications').push({status:'unread',text:this.email+" rejected the task '"+task.taskName+"' of project '"+task.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
      firebase.database().ref('projectData/'+task.projectId+'/tasks/').once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
        {
            if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
             firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({status:'unread',text:this.email+" rejected the task '"+task.taskName+"' of project '"+task.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
        }
     });

  }
  movetoprogress(task)
  {
    firebase.database().ref('projectAssigned/'+task.id).update({status:'inprogress',progress:'0',moveToProgressOn:firebase.database.ServerValue.TIMESTAMP});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/'+task.taskIndex).update({status:'inprogress',progress:'0',moveToProgressOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+task.projectId+'/notifications').push({text:this.email+" moved the task '"+task.taskName+"' in progress.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/').once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
        {
            if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
             firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({text:this.email+" moved the task '"+task.taskName+"' in progress.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
        }
     });
  }
    taskcompleted(task)
  {
    firebase.database().ref('projectAssigned/'+task.id).update({status:'completed',progress:'100',completedOn:firebase.database.ServerValue.TIMESTAMP});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/'+task.taskIndex).update({status:'completed',progress:'100',completedOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+task.projectId+'/notifications').push({text:this.email+" completed the task '"+task.taskName+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/').once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
        {
            if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
             firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({text:this.email+" completed the task '"+task.taskName+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
        }
     });
  }

  saveTaskProgress(task)
  {

    firebase.database().ref('projectAssigned/'+task.id).update({progress:task.progress,progressUpdatedOn:firebase.database.ServerValue.TIMESTAMP});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/'+task.taskIndex).update({progress:task.progress,progressUpdatedOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+task.projectId+'/notifications').push({text:this.email+" update the task '"+task.taskName+"' progress to "+task.progress+"%.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
    firebase.database().ref('projectData/'+task.projectId+'/tasks/').once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
        {
            if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
             firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({text:this.email+" update the task '"+task.taskName+"' progress to "+task.progress+"%.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:task.projectId,taskIndex:task.taskIndex,type:'auto'});
        }
     });
  }

}
