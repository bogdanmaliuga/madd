import {ChangeDetectorRef,Component} from '@angular/core';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
public name:any;
public email:any;
public uid:any;
public item:any;
public InviteSendError:any;
public invited:any =[];
public fireAuth: any;
public userData: any;
public invitaionRecv:any=[];
public inviteEmail:any;
public showInitialMessage:boolean;
public notifications:any;
public myTimelines:any=[];
public superUsers:any=[];
public CoinsPageLink:boolean=false;
public myMadCoins:any=[];
userFilter: any = { name: '' };
   ngOnInit() 
    { 
     
    }
    constructor(private router: Router, private af: AngularFire,private changeDetectorRef: ChangeDetectorRef) {
    this.invitaionRecv=[];
    this.showInitialMessage=false;
       this.name=localStorage.getItem('name');
      this.email=localStorage.getItem('email');
      this.uid=localStorage.getItem('uid');
      console.log("name==",this.name,"email==", this.email,"uid==",this.uid );
     this.fireAuth = firebase.auth();
     this.userData = firebase.database().ref('/userData'); 
     
      if(!window.localStorage.getItem('loggedin'))
        { 
        
          this.router.navigate(['login']);
        }
          console.log("uid====",this.uid);
          firebase.database().ref().child('/userData/'+this.uid+'/coins').once('value', (coins_snapshot)=> {
              if(coins_snapshot.val())
              {
                  this.CoinsPageLink=true;
                  for(let k in coins_snapshot.val())
                  this.myMadCoins.push(coins_snapshot.val()[k]);
              }
              else
              this.CoinsPageLink=false;
            });

       firebase.database().ref('/userData/').orderByChild('superuser').equalTo(true).once('value', (snapshot1)=> {
        console.log("Superuser");
        console.log(snapshot1.val());
        if(snapshot1.val())
        {
          for(let key in snapshot1.val())
          {
              let data=snapshot1.val()[key];
              data.uid=key;
              data.registered=true;
              data.sliderImages_array=[];
               if(data.sliderImages)
                   for(let imgKey in data.sliderImages)
                     data.sliderImages_array.push(data.sliderImages[imgKey].url);

              this.superUsers.push(data);
          }
          console.log('superUsers');
          console.log(this.superUsers);
        }
      });

       firebase.database().ref('/userData/'+this.uid+'/projectsAndTasks').once('value', (projectsAndTasks)=> {
      
       if(projectsAndTasks.val()!='true')
          this.showInitialMessage=true;
          this.changeDetectorRef.detectChanges();
       });
        var ref3 = firebase.database().ref().child('/timelines/'+this.uid);    
        ref3.on('value', (timelines)=> {
          console.log('timelines');
          console.log(timelines.val());
          if(timelines.val())
          {
            for(var k in timelines.val())
            {
                let d=timelines.val()[k];
                d.id=k;
                this.myTimelines.push(d);
            }
          }
        });
        var ref2 = firebase.database().ref().child('/userData/'+this.uid+'/invitations');    
        

        ref2.on('value', (snapshot1)=> {
        this.invitaionRecv=[];
        if(snapshot1.val())
        {
           console.log("snap=====",snapshot1.val().invitation);
            for(var k in snapshot1.val())
            {
               var d=snapshot1.val()[k];
               d.id=k;
               this.getUserName(k,(username)=>{
                d.username=username;
               console.log("username="+username);
               this.invitaionRecv.push(d);
               console.log("d=",d);
               this.changeDetectorRef.detectChanges();
               });
              
              
            }
             console.log(" this.invitaionRecv", this.invitaionRecv);
          }
        });
       

      
    }
pdetails(data)
      {
       console.log("data====",data);
      
       this.router.navigate(['pages/projectdetails/',data.projectid]);
      }
  invite(inviteemail){
this.InviteSendError='';
    if(inviteemail!=null && this.email!=inviteemail)
    {
        var ref2 = firebase.database().ref().child('/userData/');    
        var query = ref2.orderByChild('email').equalTo(inviteemail);

        query.once('value', (snapshot1)=> {
           console.log(snapshot1.val());
           if(snapshot1.val())
           {
            for(var k in snapshot1.val())
            {
               var d=snapshot1.val()[k];
               d.id=k;
               this.invited=d;
               console.log(d);
              
            }
              console.log(" this.invited====", this.invited);               
                // this.myprojects.forEach((key)=>{
               // console.log("id====",key.projectId);
               // this.allmyproject.push(this.getProject(key.projectId));
               // }); 

        this.userData.child(this.invited.id).child('/invitations').child(this.uid).update(
        {

          inviteFrom:this.email

        }).then((success) => {
                console.log("success==",success);
            this.userData.child(this.uid).child('/connections').child(this.invited.id).update(
            {

                contact:this.invited.email,
                status:"pending"

            });
            //notification to user
firebase.database().ref('/userData/'+this.invited.id+'/notifications').push({status:'unread',text:"You have received invitation from "+this.email,timestamp:firebase.database.ServerValue.TIMESTAMP,connection_request:'true',type:'auto'});

            this.inviteEmail='';
            alert("Invitation sent.");

          }).catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
        }
        else
        {
         //this.InviteSendError="'"+inviteemail+"' User not found. Please check user email id.";
         firebase.database().ref('/unregisteredUser/connections').push({status:'unread',invitationTo:inviteemail,senderName:this.name,senderEmail:this.email,senderId:this.uid,timestamp:firebase.database.ServerValue.TIMESTAMP,connection_request:'true',type:'auto'});
         alert("Invitation sent.");
        }
        })
     }

  }
getUserName(id,callback)
{
console.log(id);
  var d=this.userData.child(id).child('name');
   d.once('value', (username)=> {
   console.log(username.val());
   callback(username.val());
   });
  
}
accept(id,email)
{
console.log(id);
console.log(email);
  this.userData.child(id).child('connections').child(this.uid).update({status:'accepted'});

    firebase.database().ref('userData/'+this.uid+'/connections/'+id).set({contact:email,status:'accepted'});
   console.log(this.uid+'/invitations/'+id);
  firebase.database().ref('userData/'+this.uid+'/invitations/'+id).remove();
}
reject(id)
{
  this.userData.child(id).child('connections').child(this.uid).remove();
  firebase.database().ref('userData/'+this.uid+'/invitations/'+id).remove();
}
}
