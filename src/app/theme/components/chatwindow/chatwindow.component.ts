import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable,AngularFireDatabase} from 'angularfire2';
import firebase from 'firebase';
import {GlobalState} from '../../../global.state';
import { Broadcaster } from '../../../broadcaster';
@Component({
  selector: 'chat-window',
  styleUrls: ['./chatwindow.scss'],
  templateUrl: './chatwindow.html',
})
export class chatwindow {
  public showChatWindow:any;
  public partnerName:any;
  public notificationEventListener:any;
  public uid:any;
  messages: FirebaseListObservable<any[]>; 
  public partnerId:any;
  public activePageTitle:string = '';
  public message:any;
  public prifleImage:any;
  public partnerImage:any;
  public file:any;
  public uploadProgress:any;
  constructor(private _state:GlobalState,private broadcaster: Broadcaster,db: AngularFireDatabase) {

    this.showChatWindow=false;
    
    this._state.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        this.activePageTitle = activeLink.title;
      }
      this.broadcaster.on<string>('openchat')

      .subscribe(userid => {
        this.showChatWindow=false;
        this.uid=localStorage.getItem('uid');
        this.uid=localStorage.getItem('uid');
        this.prifleImage=localStorage.getItem('picture');

        this.partnerId=userid;
        var picture_ref=firebase.database().ref().child('/userData/'+userid+'/picture');    
        picture_ref.once('value', (user_picture)=> {
          if(user_picture.val())
          {
            this.partnerImage=user_picture.val();
          }
        });
        var connections_ref=firebase.database().ref().child('/userData/'+userid+'/name');    
        connections_ref.once('value', (user)=> {
        if(user.val())
        {
          firebase.database().ref().child('/userChatNotificationCounter/'+this.uid+'/'+this.partnerId).set(0);
         
          this.notificationEventListener=firebase.database().ref().child('/userChatNotificationCounter/'+this.uid+'/'+this.partnerId);
          this.notificationEventListener.on('value', (count)=> {
         console.log(count.val())
          if(count.val() && this.showChatWindow)
            firebase.database().ref().child('/userChatNotificationCounter/'+this.uid+'/'+this.partnerId).set(0);
          });
          this.showChatWindow=true;
          this.partnerName=user.val();
          this.messages = db.list('/userData/'+this.uid+'/chats/'+this.partnerId);
          
        setTimeout(function(){
          var element = document.getElementById('msg_container_base');
           element.scrollTop = element.scrollHeight - element.clientHeight; 
        },1000);

        }
        });
      });
    });
  }
   closeWindow()
   {
   console.log(this.notificationEventListener);
    
    this.showChatWindow=false;

   }
   removeFile()
   {
   this.file=0;
   }
  onChange(event) {
    this.file=0;
    console.log(event.srcElement.files[0]);
    if(event.srcElement.files[0])
    {
      
      if(event.srcElement.files[0].size<=15728640)
      {
          this.file = event.srcElement.files[0];

      }
      else
      {
        alert("File size must be less than 15MB.");
      }
    }
  }

  send(message){
    if(this.file)
    {
      this.uploadFile(this.file);
     }
    else if(message)
    { 
        this.sendMessage(message,0);
    }
  }
  sendMessage(message,fileurl)
  {
    //Add message in logged user data
        firebase.database().ref().child('/userData/'+this.uid+'/chats/'+this.partnerId).push(
        {
          timestamp:firebase.database.ServerValue.TIMESTAMP,
          text:message,
          sender:this.uid,
          fileurl:fileurl
        });  

        //Add message in logged partner data
        var c_ref=firebase.database().ref().child('/userChatNotificationCounter/'+this.partnerId+'/'+this.uid); 
        c_ref.once('value', (count)=> {
          var c=1;
          if(count.val())
           c=parseInt(count.val())+1;
           c_ref.set(c);

        });


        firebase.database().ref().child('/userData/'+this.partnerId+'/chats/'+this.uid).push(
        {
          timestamp:firebase.database.ServerValue.TIMESTAMP,
          text:message,
          sender:this.uid,
          fileurl:fileurl
        }); 
        

        this.message=''; 
        setTimeout(function(){

          var element = document.getElementById('msg_container_base');
           element.scrollTop = element.scrollHeight - element.clientHeight; 
        },500);
  }
  uploadFile(file)
  {
      var d=new Date().getTime();
       var mountainsRef = firebase.storage().ref().child('feeds/'+this.uid+'/'+d+file.name).put(file);
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
          }, (error)=> {
            // Handle unsuccessful uploads
            this.uploadProgress="Upload failed.";
          }, ()=> {
              
              var downloadURL = mountainsRef.snapshot.downloadURL;
              this.sendMessage("File shared",downloadURL);
      });    
  }
}
