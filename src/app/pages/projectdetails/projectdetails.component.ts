import {Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./projectdetails.scss';
import {Router,ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
import { orderBy } from '../../pipes/orderby';
import { PromptComponent } from '../prompt.component';
import { DialogService } from "ng2-bootstrap-modal";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
@Component({
  selector: 'projectdetails',
  templateUrl: './projectdetails.html',
})
export class ProjectDetails {
  public email:any;
  public id:any;
  public uid:any;
  public sub:any;
  public uploadProgress:any;
  public project:any;
  public deleteConfirm:any;
  public notifications:any;
  uname:any;
  public requestRecievedForTasks:any;
  public edit:boolean=  false;
  public showSmartTable:boolean=false;
  connections:any=[];
  resources=[];
  public resourcesAssignedTo:any=[];
  resource_settings = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      mode:'inline',
      confirmCreate:true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      mode:'inline',
      confirmSave:true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
  
    noDataMessage:"No Resources",
    columns: {
      id: {
        title: '#',
        type: 'string',
        filter:false,
        editable:false,
        
      },
      resourceName: {
        title: 'Resource name',
        type: 'string',
        filter:false,
      },
      resourceCost: {
        title: 'Resource cost',
        type: 'number',
        filter:false,
      },
      resourceAssignedTo: {
        title: 'Resource Assigned to',
        type: 'string',
        filter:false,
        editor:
          {
            type:"completer",
            config:{
              completer:{
                data:[],
                searchFields:'contact',
                titleField:'contact'
              }
            }
          }
      }
    }
  };
tasks_settings = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      mode:'inline',
      confirmCreate:true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      mode:'inline',
      confirmSave:true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    
    noDataMessage:"No Tasks",
    columns: {
      id: {
        title: '#',
        type: 'string',
        filter:false,
        editable:false,
        
      },
      taskName: {
        title: 'Task Name',
        type: 'string',
        filter:false,
      },
      taskDesc: {
        title: 'Task description',
        type: 'number',
        filter:false,
      },
      taskReward: {
        title: 'Reward',
        type: 'string',
        filter:false,
      },
      taskAssignedTo: {
        title: 'Task Assigned To',
        type: 'string',
        filter:false,
        editor:
          {
            type:"completer",
            config:{
              completer:{
                data:[],
                searchFields:'contact',
                titleField:'contact'
              }
            }
          }
      }
    }
  };
 
  resources_temp: LocalDataSource = new LocalDataSource();
  tasks_temp: LocalDataSource = new LocalDataSource();

  constructor(fb:FormBuilder,private af: AngularFire,private _sanitizer: DomSanitizer,private router: Router,private route: ActivatedRoute,private dialogService:DialogService) 
  {
  if(!window.localStorage.getItem('loggedin'))
        { 
        
          this.router.navigate(['login']);
        }
    this.uname= localStorage.getItem('name');    
    this.email= localStorage.getItem('email');
    this.uid=localStorage.getItem('uid');
    this.deleteConfirm=false;
    this.requestRecievedForTasks=[];
     firebase.database().ref('/userData/'+this.uid+'/connections').once('value',(connections)=>{
          this.connections=[];
          if(connections.val())
          {
            for(var k in connections.val())
            {
              var d=connections.val()[k];
              d.id=k;
              this.connections.push(d);
              this.resource_settings.columns.resourceAssignedTo.editor.config.completer.data.push(d);
              this.tasks_settings.columns.taskAssignedTo.editor.config.completer.data.push(d);
              
            }
            
          }
          setTimeout(()=>{
              console.log(this.resource_settings);
              this.showSmartTable=true;
              this.resource_settings.columns.resourceAssignedTo.editor.config.completer.data.push({contact:this.email});
              this.tasks_settings.columns.taskAssignedTo.editor.config.completer.data.push({contact:this.email});
            },2000);
        });
  }
  editProject()
  {
    this.edit=true;
  }
  saveProject()
  {
     this.edit=false;
     firebase.database().ref('projectData/'+this.id).update({projectname:this.project.projectname,projectobjective:this.project.projectobjective,type:this.project.type});
     for(let k in this.project.resources)
     {
       firebase.database().ref('projectData/'+this.id+'/resources/'+k).update(this.project.resources[k]);
       console.log(this.project.resources[k]);
     }
     for(let k in this.resources)
     {
       console.log(k);
       let i=parseInt(this.project.resources.length)+parseInt(k);
       
       firebase.database().ref('projectData/'+this.id+'/resources/'+i).update({resourceAssignedTo:this.resources[k].resourceAssignedTo,resourceCost:this.resources[k].resourceCost,resourceName:this.resources[k].resourceName,status:"pending"});
       console.log(this.resources[k]);
     }
     this.uploadAssignedResources(this.project,this.id);
  }
   showPrompt() {
    this.dialogService.addDialog(PromptComponent, {
      title:'Add Feed',
      question:'Message: '})
      .subscribe((result)=>{
        //We get dialog result
        console.log(result);
        if(result['message'] && !result['file'])
        {
          firebase.database().ref('projectData/'+this.id+'/notifications').push({text:result['message'],timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,type:'user',email:this.email,contain:'onlytext'});
          firebase.database().ref('projectData/'+this.id+'/tasks/').once('value', (snapshot1)=> {
            for(var k in snapshot1.val())
              {
                  if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
                  firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({text:this.email+" added feed on project'"+this.project.projectname+"'",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:-1,type:'auto'});
              }
          });

        }
        else if(result['message'] && result['file'])
        {
          this.uploadFileAndSendMsg(result['message'],result['file']);
        }
        else if(!result['message'] && result['file'])
        {
          this.uploadFileAndSendMsg(0,result['file']);
        }
        else
        {

        }
      });
  }
ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id']; 
       if(this.id)
       {
       this.project={};
        var ref2 = firebase.database().ref('/projectData/'+this.id);
        ref2.on('value', (project)=> {
             
             this.notifications=[];
             this.project=project.val();
             console.log(this.project);
             if(this.project.tasks)
             {
             if(this.project.tasks.length>0)
             {
               this.project.tasks.forEach((element,i) => {
                  firebase.database().ref('projectData/'+this.id+'/taskRequested/'+i+'/'+this.uid+'/status').once('value').then((snap) => {
                  console.log(snap.val())
                  if(snap.val())
                  this.project.tasks[i].requested=true;
                  else
                   this.project.tasks[i].requested=false;
                });
               });
               if(this.email==this.project.createdBy)
               {
                 this.requestRecievedForTasks=[];
                    var a_ref=firebase.database().ref('/projectAssigned/').orderByChild('projectId').equalTo(this.id);
                    a_ref.once('value', (snapshot1)=> {
                    for(var k in snapshot1.val())
                    {
                        if(snapshot1.val()[k].NeedToApproved)
                        {
                          var d=snapshot1.val()[k];
                          d.id=k;
                          this.requestRecievedForTasks.push(d);
                        }
                    }

                  }); 
               }
             }
            }
            for(let k in project.val()['resources'])
            {
              var d=project.val()['resources'][k];
              d.id=parseInt(k)+1;
               //this.resources_temp.push(d);
               this.resources_temp.add(d);
            }
            

              //if(project.val()['type']=="public")
               // this.project=project.val();
              //else if(project.val()['createdBy']==this.email)
              //  this.project=project.val();
             // else
              //{

             // }
              if(this.project)
              {
               var notifications=[];
                  for(var k in this.project.notifications)
                  {
                    var d=this.project.notifications[k];
                    d.id=k;
                    notifications.push(d);
                  }
                   this.notifications=this.sort(notifications);
                  
              }
          });
       }
       
      
    });
  }
   saveResource(event,type): void {
   
     //$("#clickoutside").trigger('click');
      var resource=event.newData;
      console.log(resource);
      if(type=='save')
      {
        event.newData.id=this.resources.length+1;
      }

        console.log(event);
         
        if(resource.resourceName && resource.resourceCost)
        {
          if(resource.resourceAssignedTo)
          {
            var ref2 = firebase.database().ref('/userData/');    
            var query = ref2.orderByChild('email').equalTo(resource.resourceAssignedTo);
            query.once('value', (snapshot1)=> {
            if(snapshot1.val())
            {
              for(var k in snapshot1.val())
              {
                if(type=='save')
                {
                  this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending',new:true});
                  this.resourcesAssignedTo.push({email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,resourceIndex:this.resources.length-1,id:k,registeredUser:true});
                }
                if(type=='edit')
                {
                  if(resource.new==true)
                      {
                         this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending',new:true};
                         this.resourcesAssignedTo[resource.id-1]={email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,id:k,registeredUser:true};
                      }
                      else{
                         this.project.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo};
                           if(resource.resourceAssignedTo!=event.data.resourceAssignedTo)
                           {
                             
                              this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'});
                              this.resourcesAssignedTo.push({email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,resourceIndex:this.resources.length-1,id:k,registeredUser:true});
                          }
                     
                      }
                 }
              
              }
              event.confirm.resolve(event.newData);
              console.log(this.resources);
          }
          else
          {
              if(type=='save')
                {
                  this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending',new:true});
                  this.resourcesAssignedTo.push({email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,resourceIndex:this.resources.length-1,registeredUser:false});
                }
              if(type=='edit')
                {
                  if(resource.new==true)
                      {
                            this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending',new:true};
                            this.resourcesAssignedTo[resource.id-1]={email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,registeredUser:false};
                      }
                      else{

                        this.project.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo};
                        if(resource.resourceAssignedTo!=event.data.resourceAssignedTo)
                           {
                             this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'};
                            this.resourcesAssignedTo[resource.id-1]={email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,registeredUser:false};
                          }
                          
                      }
              }
              event.confirm.resolve(event.newData);
          }
          });
        }
        else
        {
          if(type=='save')
                {
                this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending',new:true});
                }
            if(type=='edit')
                            {
                              if(resource.new==true)
                              {
                                 this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'};
                              }
                              else{
                                 this.project.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo};
                              }
                            }
          event.confirm.resolve(event.newData);
        }
          }
          else
          {
            event.confirm.reject();
            alert("Please fill all the field of resource");
          }
      
          
  }
  rejectRequest(task,index)
  {
    if(task.id)
    {
      console.log(task.taskIndex);
      console.log(this.uid);
      firebase.database().ref('/projectAssigned/'+task.id).remove();
       firebase.database().ref('projectData/'+this.id+'/taskRequested/'+task.taskIndex+'/'+task.userid).remove();
      this.requestRecievedForTasks=[];
                    var a_ref=firebase.database().ref('/projectAssigned/').orderByChild('projectId').equalTo(this.id);
                    a_ref.once('value', (snapshot1)=> {
                    for(var k in snapshot1.val())
                    {
                        if(snapshot1.val()[k].NeedToApproved)
                        {
                          var d=snapshot1.val()[k];
                          d.id=k;
                          this.requestRecievedForTasks.push(d);
                        }
                    }

                  });
  }
  }
  acceptRequest(task)
  {
    if(task.id)
    {
      firebase.database().ref('/projectAssigned/'+task.id).update({NeedToApproved:false});
      firebase.database().ref('projectData/'+this.id+'/taskRequested/'+task.taskIndex).remove();
     firebase.database().ref('/projectData/'+this.id+'/tasks/'+task.taskIndex).update({status:'accepted',taskAssignedTo:task.email,userid:task.userid,acceptedOn:firebase.database.ServerValue.TIMESTAMP});
    }
  }
uploadFileAndSendMsg(message,file)
{
    var d=new Date().getTime();
   var mountainsRef = firebase.storage().ref().child('feeds/'+this.uid+'/'+d+file[0].name).put(file[0]);
    mountainsRef.on('state_changed', (snapshot)=>{
    
     this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     //this.changeDetectorRef.detectChanges();
                    
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },(error)=> {
      // Handle unsuccessful uploads
      this.uploadProgress="Upload failed.";
    },()=>{
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        var downloadURL = mountainsRef.snapshot.downloadURL;
        if(message)
        {
          firebase.database().ref('projectData/'+this.id+'/notifications').push({text:message,timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,type:'user',email:this.email,contain:'textAndFile',fileType:file[0].type,url:downloadURL});
          
        }
        else
        {
            firebase.database().ref('projectData/'+this.id+'/notifications').push({text:'',timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,type:'user',email:this.email,contain:'onlyFile',fileType:file[0].type,url:downloadURL});
        }
         firebase.database().ref('projectData/'+this.id+'/tasks/').once('value', (snapshot1)=> {
            for(var k in snapshot1.val())
              {
                  if(snapshot1.val()[k].userid && snapshot1.val()[k].userid!=this.uid)
                  firebase.database().ref('userData/'+snapshot1.val()[k].userid+'/notifications').push({text:this.email+" added feed on project'"+this.project.projectname+"'",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:-1,type:'auto'});
              }
          });
        //this.changeDetectorRef.detectChanges();
   });
}
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  sort(array)
  {
  array.sort((a: any, b: any) => {
    
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(array);
    return array;
  }
  
movetoprogress(task,taskIndex)
  {

  var a_ref=firebase.database().ref('/projectAssigned/').orderByChild('projectId').equalTo(this.id);
  a_ref.once('value', (snapshot1)=> {
  for(var k in snapshot1.val())
  {
      if(snapshot1.val()[k].email==task.taskAssignedTo && snapshot1.val()[k].taskIndex==taskIndex)
      {
          firebase.database().ref('projectAssigned/'+k).update({status:'inprogress',progress:'0',moveToProgressOn:firebase.database.ServerValue.TIMESTAMP});
      }
  }

  });

    


    firebase.database().ref('projectData/'+this.id+'/tasks/'+taskIndex).update({status:'inprogress',progress:'0',moveToProgressOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+this.id+'/notifications').push({text:this.email+" moved the task '"+task.taskName+"' in progress.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:taskIndex,type:'auto'});

  }
    taskcompleted(task,taskIndex)
  {

  var a_ref=firebase.database().ref('/projectAssigned/').orderByChild('projectId').equalTo(this.id);
  a_ref.once('value', (snapshot1)=> {
  for(var k in snapshot1.val())
  {
      if(snapshot1.val()[k].email==task.taskAssignedTo && snapshot1.val()[k].taskIndex==taskIndex)
      {
          firebase.database().ref('projectAssigned/'+k).update({status:'completed',progress:'100',completedOn:firebase.database.ServerValue.TIMESTAMP});
      }
  }

  });


   
    firebase.database().ref('projectData/'+this.id+'/tasks/'+taskIndex).update({status:'completed',progress:'100',completedOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+this.id+'/notifications').push({text:this.email+" completed the task '"+task.taskName+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:taskIndex,type:'auto'});

  }
  
  saveTaskProgress(task,taskIndex)
  {
 
      var a_ref=firebase.database().ref('/projectAssigned/').orderByChild('projectId').equalTo(this.id);
      a_ref.once('value', (snapshot1)=> {
      for(var k in snapshot1.val())
      {
        if(snapshot1.val()[k].email==task.taskAssignedTo && snapshot1.val()[k].taskIndex==taskIndex)
        {
          firebase.database().ref('projectAssigned/'+k).update({progress:task.progress,progressUpdatedOn:firebase.database.ServerValue.TIMESTAMP});
        }
      }

  });
  firebase.database().ref('projectData/'+this.id+'/tasks/'+taskIndex).update({progress:task.progress,progressUpdatedOn:firebase.database.ServerValue.TIMESTAMP});

    firebase.database().ref('projectData/'+this.id+'/notifications').push({text:this.email+" update the task '"+task.taskName+"' progress to "+task.progress+"%.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:taskIndex,type:'auto'});

  }
  deleteProject()
  {
      this.deleteConfirm=true;
  }
  deleteProjectConfirm()
  {
   firebase.database().ref('projectData/'+this.id).remove();
   var projectAssigned_ref2=firebase.database().ref('projectAssigned').orderByChild('projectId').equalTo(this.id);
    projectAssigned_ref2.once('value', (snapshot1)=> { 
      for(var k in snapshot1.val())
      {
        firebase.database().ref('projectAssigned/'+k).remove();
      }
     });   
  }
  deleteProjectCancel()
  {
      this.deleteConfirm=false;
  }
   getProfilePicStyle(profilePicUrl) {
    // snip snip -> fetch the url from somewhere
    if(profilePicUrl)
    {
      const profilePicUrl1 = profilePicUrl;
     return this._sanitizer.bypassSecurityTrustStyle(`${profilePicUrl1}`);
    }
    else
    return null;
   }
  sanitizerURL(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
 
  RequestResponsibility(type,task,taskIndex)
  {
    console.log(task);
    if(type=="1")
    {
      firebase.database().ref('/projectAssigned').push(
          {
            projectId: this.id,
            email: this.email,
            userid: this.uid,
            taskName:task.taskName,
            taskDesc:task.taskDesc,
            taskReward:task.taskReward,
            taskIndex:taskIndex,
            status:"accepted",
            projectname:this.project.projectname,
            projecttype:this.project.type,
            ownerId:this.project.ownerId,
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            type:'task',
            NeedToApproved:true
          }).then((snap) => {
            console.log("4");
           const key1 = snap.key; 
           console.log("Pushed id :" +key1);
           firebase.database().ref('projectData/'+this.id+'/taskRequested/'+taskIndex+'/'+this.uid).update({status:true});
           firebase.database().ref('userData/'+this.project.ownerId+'/notifications').push({status:'unread',text:this.email+" requested task '"+task.taskName+"' responsibility of project '"+this.project.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,taskIndex:taskIndex,type:'auto'});
          });
    }
   if(type=="2")
    {
        firebase.database().ref('/projectAssigned').push(
          {
            projectId: this.id,
            email: this.email,
            taskName:task.taskName,
            taskDesc:task.taskDesc,
            taskReward:task.taskReward,
            taskIndex:taskIndex,
            status:"accepted",
            projectname:this.project.projectname,
            projecttype:this.project.type,
            ownerId:this.project.ownerId,
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            type:'task'
          });
    }

  }
  uploadAssignedResources(data,projectid)
{
   for(var r=0;r< this.resourcesAssignedTo.length;r++)
                {
                  let pushData=
                  {
                    projectId: projectid,
                    email: this.resourcesAssignedTo[r].email,
                    resourceName:this.resourcesAssignedTo[r].resourceName,
                    resourceCost:this.resourcesAssignedTo[r].resourceCost,
                    resourceIndex:this.resourcesAssignedTo[r].resourceIndex,
                    status:"pending",
                    projectname:data.projectname,
                    projecttype:data.type,
                    ownerId:this.uid,
                    timestamp:firebase.database.ServerValue.TIMESTAMP,
                    type:'resource'};
                  if(this.resourcesAssignedTo[r].registeredUser)
                  {
                  firebase.database().ref('userData/'+this.resourcesAssignedTo[r].id+'/notifications').push({status:'unread',text:this.email+" assigned resources '"+this.resourcesAssignedTo[r].resourceName+"' of project '"+data.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.id,assignedResourceIndex:this.resourcesAssignedTo[r].resourceIndex,type:'auto'});

                  firebase.database().ref('/projectAssigned').push(
                  pushData).then((snap) => {
                    console.log("5");

                  const key1 = snap.key; 
                  console.log("Pushed id :" +key1);
                  console.log("length :" +this.resourcesAssignedTo.length);
                  console.log("i :" +r);
                  
                  if(this.resourcesAssignedTo.length==r)
                  {
                   
                    
                  }
                }) 
                }
                else
                {
                  firebase.database().ref('/unregisteredUser/resources').push({status:'unread',invitationTo:this.resourcesAssignedTo[r].email,senderName:this.uname,senderEmail:this.email,senderId:this.uid,timestamp:firebase.database.ServerValue.TIMESTAMP,type:'auto',data:pushData});
                  if(this.resourcesAssignedTo.length==r)
                  {
                    

                    
                  }
                }   
                }
}

  setBackground(event){
    if(event)
    {
    console.log(event.srcElement.files[0]);
    if(event.srcElement.files[0])
    {
      
      if(event.srcElement.files[0].size<=15728640)
      {
         
          var d=new Date().getTime();
          var mountainsRef = firebase.storage().ref().child('projectbg/'+this.id).put(event.srcElement.files[0]);
            mountainsRef.on('state_changed', (snapshot)=>{
            
            this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //this.changeDetectorRef.detectChanges();
                            
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            },(error)=> {
              // Handle unsuccessful uploads
              this.uploadProgress="Upload failed.";
            },()=>{
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...

                var downloadURL = mountainsRef.snapshot.downloadURL;
                firebase.database().ref('projectData/'+this.id+'/').update({background:downloadURL});
                //this.changeDetectorRef.detectChanges();
          });

      }
      else
      {
        alert("File size must be less than 15MB.");
      }
    }
    
  }
 
  }
}
