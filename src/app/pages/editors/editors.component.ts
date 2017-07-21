import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import 'style-loader!../login/login.scss';
import firebase from 'firebase';
import 'style-loader!./editor.scss';
import { LocalDataSource } from 'ng2-smart-table';
declare var google:any;
@Component({
  selector: 'editors',
  templateUrl: './editor.html'
})
export class Editors {
  public form:FormGroup;
  public projectname:any;
  public projectobjective:any;
  public type:any;
  public taskAddError:any;
  public resource:any;
  public resources:any;
  public tasks:any=[];
  public showTaskForm:any;
  public showResourceForm:any;
  public task:any;
  public showSubmit:any=true;
  data:any=[];
  public fireAuth: any;
  public ProjectData: any;
  public projectAssigned: any;
  public projectid:any;
  public assignedTo:any=[];
  public resourcesAssignedTo:any=[];
  public userEmail:any;
  public uid:any;
  public uName:any;
  public connections:any;
  public address : Object;
  public autocomplete:any;  
  public backgroundImage:any;  
  public backgroundImagePreview:any;
  public uploadProgress:any;
  fullAddress:any;
 public showSmartTable:boolean=false;

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
   constructor(private fb:FormBuilder, private router: Router) {
    
   setTimeout(()=>{
   console.log(document.getElementById('googleplace_auto'));
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('googleplace_auto'), {});
    google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
          var place = this.autocomplete.getPlace();
          this.address = place['formatted_address'];
           var location = place['geometry']['location'];
           var lat =  location.lat();
           var lng = location.lng();
           this.fullAddress={address:place['formatted_address'],location:lat+','+lng}
        console.log(this.fullAddress);
        });
        },1000);
  if(!window.localStorage.getItem('loggedin'))
        { 
        
          this.router.navigate(['login']);
        }

      this.resources=[];
     
      this.tasks=[]; 
      this.data.showOnDashbpard=false;    
       this.fireAuth = firebase.auth();
       this.ProjectData = firebase.database().ref('/projectData');  
       this.projectAssigned = firebase.database().ref('/projectAssigned');
       
       this.userEmail=localStorage.getItem('email');
       this.uid=localStorage.getItem('uid');
       this.uName=localStorage.getItem('name');
       
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
              this.resource_settings.columns.resourceAssignedTo.editor.config.completer.data.push({contact:this.userEmail});
              this.tasks_settings.columns.taskAssignedTo.editor.config.completer.data.push({contact:this.userEmail});
            },2000);
        });

	}

   onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }


  addResource()  {
   this.resource={resourceName: '', resourceCost:'',resourceAssignedTo:0};
    this.showResourceForm=true;
  
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
                  this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'});
                  this.resourcesAssignedTo.push({email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,resourceIndex:this.resources.length-1,id:k,registeredUser:true});
                }
                if(type=='edit')
                {
                 this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'};
                 this.resourcesAssignedTo[resource.id-1]={email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,id:k,registeredUser:true};
               }
              
              }
              event.confirm.resolve(event.newData);
              console.log(this.resources);
          }
          else
          {
              /*if(type=='save')
                {
                  this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'});
                  this.resourcesAssignedTo.push({email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,resourceIndex:this.resources.length-1,registeredUser:false});
                }
              if(type=='edit')
                {
                this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'};

                this.resourcesAssignedTo[resource.id-1]={email:resource.resourceAssignedTo,resourceName: resource.resourceName, resourceCost:resource.resourceCost,registeredUser:false};
              }
              event.confirm.resolve(event.newData);*/
              event.confirm.reject();
            alert("Email address is not registered.");
          }
          });
        }
        else
        {
          if(type=='save')
                {
                this.resources.push({resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'});
                }
            if(type=='edit')
                            {
                           this.resources[resource.id-1]={resourceName:resource.resourceName, resourceCost:resource.resourceCost,resourceAssignedTo:resource.resourceAssignedTo,status:'pending'};
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
  addTask()  {
  this.task={taskName: '', taskDesc:'',taskReward:'',taskAssignedTo:0};
  this.showTaskForm=true;
 
  }
saveTask(event,type): void {
 
  var input=event.newData;
  console.log(input);
      if(type=='save')
      {
        event.newData.id=this.tasks.length+1;
      }
  this.taskAddError="";
  if(input.taskName && input.taskDesc && input.taskReward )
  {
    if(input.taskAssignedTo)
    {
       console.log("2");
    var ref2 = firebase.database().ref('/userData/');    
    var query = ref2.orderByChild('email').equalTo(input.taskAssignedTo);
    query.once('value', (snapshot1)=> {
      console.log("1");
     if(snapshot1.val())
     {
       console.log("3");
        for(var k in snapshot1.val())
        {
          console.log("4");
          if(type=='save')
            {
              console.log("5");
              this.tasks.push({taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending'});

              this.assignedTo.push({email:input.taskAssignedTo,taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskIndex:this.tasks.length-1,id:k,registeredUser:true});
            }
            if(type=='edit')
            {
              console.log("6");
              this.tasks[input.id-1]={taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending'};

              this.assignedTo[input.id-1]={email:input.taskAssignedTo,taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,id:k,registeredUser:true};
            }
            event.confirm.resolve(event.newData);
          }
     }
     else
     {
       /* if(type=='save')
            {
              console.log("5");
              this.tasks.push({taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending'});

              this.assignedTo.push({email:input.taskAssignedTo,taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskIndex:this.tasks.length-1,registeredUser:false});
            }
            if(type=='edit')
            {
              console.log("6");
              this.tasks[input.id-1]={taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending'};

              this.assignedTo[input.id-1]={email:input.taskAssignedTo,taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,registeredUser:false};
            }
            event.confirm.resolve(event.newData);*/
             event.confirm.reject();
            alert("Email address is not registered.");
     }
    });
  }
  else
  {
          if(type=='save')
            {
              this.tasks.push({taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending',});
            }
            if(type=='edit')
            {
              this.tasks[input.id-1]={taskName: input.taskName, taskDesc:input.taskDesc,taskReward:input.taskReward,taskAssignedTo:input.taskAssignedTo,status:'pending'};
            }
            event.confirm.resolve(event.newData);

  }
    
  }
  else
  {
    event.confirm.reject();
    alert("Please fill all the field of task");
  }
    
}
setBackground(event){
    if(event)
    {
    
    if(event.srcElement.files[0])
    {
      
      if(event.srcElement.files[0].size<=15728640)
      {
         
          this.backgroundImage=event.srcElement.files[0];
          var oFReader = new FileReader();
          oFReader.readAsDataURL(this.backgroundImage);

          oFReader.onload = (oFREvent) =>{
            
             this.backgroundImagePreview = oFREvent.target;
          };
      }
      else
      {
        alert("File size must be less than 15MB.");
        this.backgroundImage=0;
      }
    }
    
  }
  else
  {
     this.backgroundImage=0;
  }
 
}

  onSubmit(data) {
   
    console.log(data);
    console.log("1");
    console.log(this.resources);
    console.log(this.tasks);
    console.log("location="+this.fullAddress);
    if(data.type && data.projectname && data.projectobjective){
      this.showSubmit=false;
       this.ProjectData.push(
        {
          projectname:data.projectname,
          projectobjective:data.projectobjective,
          resources:this.resources,
          tasks:this.tasks,
          type:data.type,
          createdBy: this.userEmail,
          ownerId:this.uid,
          location:this.fullAddress,
          showOnDashbpard:data.showOnDashbpard,
          timestamp:firebase.database.ServerValue.TIMESTAMP
        }).then((snap) => {
          console.log("2");
        firebase.database().ref('/userData/'+this.uid).update({projectsAndTasks:'true'});

         const key = snap.key;
         this.projectid=snap.key;
         console.log("Pushed id   this.projectid:", this.projectid);
         console.log(this.assignedTo);
         if(data.showOnDashbpard && data.type=='private' && !this.backgroundImage)
          {
            if(this.connections)
            this.connections.forEach((entry)=>{
                 firebase.database().ref('/timelines/'+entry.id).push({type:'projectadded',projectName:data.projectname,projectid:this.projectid,userName:this.uName,timestamp:firebase.database.ServerValue.TIMESTAMP,});
            });
          }
          if(this.assignedTo.length>0)
            this.uploadAssignedTasks(data,this.projectid);
          else if(this.resourcesAssignedTo.length>0)
            this.uploadAssignedResources(data,this.projectid);
          else
           this.projectPosted(data);
          
      })     
  
  
    }    
    else{
      console.log("no data");
    }

       
   
  }
  uploadAssignedTasks(data,projectid)
{
  for(var i=0;i< this.assignedTo.length;i++)
        {
          let pushData=
          {
            projectId: this.projectid,
            email: this.assignedTo[i].email,
            taskName:this.assignedTo[i].taskName,
            taskDesc:this.assignedTo[i].taskDesc,
            taskReward:this.assignedTo[i].taskReward,
            taskIndex:this.assignedTo[i].taskIndex,
            status:"pending",
            projectname:data.projectname,
            projecttype:data.type,
            ownerId:this.uid,
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            type:'task'
          };
          if(this.assignedTo[i].registeredUser)
          {
            console.log("3");
            firebase.database().ref('userData/'+this.assignedTo[i].id+'/notifications').push({status:'unread',text:this.userEmail+" assigned task '"+this.assignedTo[i].taskName+"' of project '"+data.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.projectid,assignedTaskIndex:this.assignedTo[i].taskIndex,type:'auto'});

           this.projectAssigned.push(pushData).then((snap) => {
            console.log("4");
           const key1 = snap.key; 
           console.log("Pushed id :" +key1);
           console.log("length :" +this.assignedTo.length);
           console.log("i :" +i);
           
           if(this.assignedTo.length==i)
           {
            if(this.resourcesAssignedTo.length>0)
               this.uploadAssignedResources(data,projectid);
             else
               this.projectPosted(data);
           }
         })    
        }
        else
      {
        firebase.database().ref('/unregisteredUser/tasks').push({status:'unread',invitationTo:this.assignedTo[i].email,senderName:this.uName,senderEmail:this.userEmail,senderId:this.uid,timestamp:firebase.database.ServerValue.TIMESTAMP,type:'auto',data:pushData});
        if(this.assignedTo.length==i)
           {
            if(this.resourcesAssignedTo.length>0)
               this.uploadAssignedResources(data,projectid);
             else
               this.projectPosted(data);
           }
      }
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
                  firebase.database().ref('userData/'+this.resourcesAssignedTo[r].id+'/notifications').push({status:'unread',text:this.userEmail+" assigned resources '"+this.resourcesAssignedTo[r].resourceName+"' of project '"+data.projectname+"'.",timestamp:firebase.database.ServerValue.TIMESTAMP,project:this.projectid,assignedResourceIndex:this.resourcesAssignedTo[r].resourceIndex,type:'auto'});

                  this.projectAssigned.push(
                  pushData).then((snap) => {
                    console.log("5");

                  const key1 = snap.key; 
                  console.log("Pushed id :" +key1);
                  console.log("length :" +this.resourcesAssignedTo.length);
                  console.log("i :" +r);
                  
                  if(this.resourcesAssignedTo.length==r)
                  {
                    this.projectPosted(data);

                    
                  }
                }) 
                }
                else
                {
                  firebase.database().ref('/unregisteredUser/resources').push({status:'unread',invitationTo:this.resourcesAssignedTo[r].email,senderName:this.uName,senderEmail:this.userEmail,senderId:this.uid,timestamp:firebase.database.ServerValue.TIMESTAMP,type:'auto',data:pushData});
                  if(this.resourcesAssignedTo.length==r)
                  {
                    this.projectPosted(data);

                    
                  }
                }   
                }
}
projectPosted(data)
{
  if(this.backgroundImage)
                    {
                      console.log("6");
                       var d=new Date().getTime();
                        var mountainsRef = firebase.storage().ref().child('projectbg/'+this.projectid).put(this.backgroundImage);
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
                            console.log("7");
                              var downloadURL = mountainsRef.snapshot.downloadURL;
                              firebase.database().ref('projectData/'+this.projectid+'/').update({background:downloadURL});
                               this.data=[];
                              this.assignedTo=[];
                              this.resources=[];
                              this.tasks=[];

                                if(data.showOnDashbpard && data.type=='private')
                                {
                                  console.log("8");
                                  if(this.connections)
                                  {
                                    console.log("9");
                                    if(this.connections.length>0)
                                    {
                                      console.log("10");
                                      this.connections.forEach((entry,index)=>{
                                        firebase.database().ref('/timelines/'+entry.id).push({type:'projectadded',projectPic:downloadURL,projectName:data.projectname,projectid:this.projectid,userName:this.uName,timestamp:firebase.database.ServerValue.TIMESTAMP,});
                                        if(index==this.connections.length-1)  
                                        {
                                          alert('Projeto Adicionado. Vá Fazer a Diferença');
                                          this.router.navigate(['pages/components']);
                                        }
                                      });
                                    }
                                    else
                                    {
                                      console.log("11");
                                      alert('Projeto Adicionado. Vá Fazer a Diferença');
                                      this.router.navigate(['pages/components']);
                                    }
                                  }
                                else
                                {
                                  console.log("2");
                                  alert('Projeto Adicionado. Vá Fazer a Diferença');
                                    this.router.navigate(['pages/components']);
                                }
                              }
                              else
                              {
                                console.log("13");
                                  alert('Projeto Adicionado. Vá Fazer a Diferença');
                                  this.router.navigate(['pages/components']);
                              }
          
                              
                              

                              //this.changeDetectorRef.detectChanges();
                        });
                    }
                    else{
                     console.log("14");
                       this.data=[];
                    this.assignedTo=[];
                    this.resources=[];
                    this.tasks=[];
                    alert('Projeto Adicionado. Vá Fazer a Diferença');
                    //this.router.navigate(['pages/components']);
                    }

                       
}
}
