import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./partnerdetails.scss';
import {Router,ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';

import firebase from 'firebase';
declare var google:any;

@Component({
  selector: 'partnerdetails',
  templateUrl: './partnerdetails.html',
})
export class Partnerdetails {
  public email:any;
  public uid:any;
  public name:any;
  public showEdit:boolean=false;
  public showDonateCoins:boolean=false;
  public edit:boolean=false;
  public availableCoins:any;
  public donationamount:any;
  public prifleImage:any;
  public pid:any;
   public sid:any;
  public partnerUser:any=[];
  public superUserDetails:any={};
  public sliderImages:any=[];
  public sliderImages_temp:any=[];
  constructor(fb:FormBuilder,private af: AngularFire,private router: Router,private route: ActivatedRoute, public changeDetectorRef: ChangeDetectorRef) {
  if(!window.localStorage.getItem('loggedin'))
        { 
        
          this.router.navigate(['login']);
        }
    this.email= localStorage.getItem('email');
    this.uid=localStorage.getItem('uid');
    this.name=localStorage.getItem('name');
    this.prifleImage=localStorage.getItem('picture');
  
    
    

  };
  edit_fun()
  {
    this.edit=true;
  }
  save_fun()
  {
    if(this.partnerUser.name)
    {
      
        if(this.partnerUser.email)
        {
           
          
         // this.showSubmit1=false;
          var ref2 = firebase.database().ref('/userData/');    
            var query = ref2.orderByChild('email').equalTo(this.partnerUser.email);
            query.once('value', (snapshot1)=> {
            if(snapshot1.val())
            {
              for(var k in snapshot1.val())
              {
                let data={email:this.partnerUser.email,uid:k,name:this.partnerUser.name,fullDescription:'',shortDescription:'',contactInformation:'',madCoinsTarget:'Unlimited'};
                  if(this.partnerUser.fullDescription)
                   data.fullDescription=this.partnerUser.fullDescription;
                   if(this.partnerUser.shortDescription)
                   data.shortDescription=this.partnerUser.shortDescription;
                   if(this.partnerUser.contactInformation)
                   data.contactInformation=this.partnerUser.contactInformation;
                   if(this.partnerUser.madCoinsTarget)
                   data.madCoinsTarget=this.partnerUser.madCoinsTarget;

                      //firebase.database().ref('/userData/'+k).update({cpf:this.partnerUser.CPF});
                      firebase.database().ref('/userData/'+k+'/partnerWith/'+this.uid).update({name:this.name});
                      firebase.database().ref('/userData/'+this.uid+'/myPartners/'+k).update(data);
                       if(this.sliderImages_temp.length==0)
                        {
                          this.edit=false;
                           this.sliderImages_temp=[];
                          
                        }
                        else
                        {
                          this.uploadSliderImages(k);
                        }
                      
                    
                
                  
              }
            }
            
            });
         
        } 
        else
        {
          alert("Please fill  Email");
        }
      
    }else
        {
          alert("Please fill Name");
        }
  }
   onSliderChange(event)
  {
    let file = event.srcElement.files;
     if(file[0])
      {
       //if(file[0].size<=2228571)
        //{
          this.sliderImages_temp.push(file[0]);
       // }
        //else
        //{
        //      alert("File size must be less than 2MB.");
       // }
      }
  }
   uploadSliderImages(k)
{

  this.sliderImages_temp.forEach((entry,index) => {
    let date=new Date().getTime();
         var mountainsRef = firebase.storage().ref().child('slider/'+k+'/'+date).put(entry);
        mountainsRef.on('state_changed', (snapshot)=>{
        //this.uploadProgressIndex=index;
        //this.uploadProgress1 = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.changeDetectorRef.detectChanges();
                        
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
          //this.uploadProgress1="Upload failed.";
        }, ()=> {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...

            var downloadURL = mountainsRef.snapshot.downloadURL;
            
            var ref = firebase.database().ref('/userData/'+this.uid+'/myPartners/'+k+"/sliderImages").push({url:downloadURL});
            
            //this.uploadProgress1=false;
            this.partnerUser.sliderImages_array.push(downloadURL);
           
            this.changeDetectorRef.detectChanges();
              if(this.sliderImages_temp.length==index+1)
                {this.edit=false;
                 this.sliderImages_temp=[];}
            });
  });
     
         
      
      
}
  donate()
  {
    var r = confirm("Donate "+this.donationamount+" coins to "+this.partnerUser.name+"?");
    if (r == true) {
       
   
    let amount=this.donationamount;
    let partner_id=this.pid
    let availableCoins=this.availableCoins;
    let superUserId=this.sid;
    console.log(amount);
    console.log(partner_id);
    if(amount<=availableCoins)
    {
     // document.getElementById('input-donate-'+partner_id).style.display="none";
      //document.getElementById('btn-donate-'+partner_id).style.display="none";
         firebase.database().ref('/userData/'+partner_id+'/donation').push({amount:amount,donatorEmail:this.email,donatorId:this.uid,donatorName:this.name,superUserId:superUserId,timestamp:firebase.database.ServerValue.TIMESTAMP}).then(()=>{
           let coins=availableCoins-amount;
           if(coins)
           {
              firebase.database().ref('/userData/'+this.uid+'/coins/'+superUserId).update({amount:coins});
                  
           }
           else
           {
             firebase.database().ref('/userData/'+this.uid+'/coins/'+superUserId).remove();
           }
          // document.getElementById('input-donate-'+partner_id).style.display="block";
      //document.getElementById('btn-donate-'+partner_id).style.display="block";
           firebase.database().ref('/userData/'+partner_id+'/notifications').push({status:'unread',text:"You have received "+amount+" coins from "+this.email,timestamp:firebase.database.ServerValue.TIMESTAMP,type:'auto',noAction:true});
           alert("Thank You for Making the Difference");
           this.donationamount='';
           this.ngOnInit();

        });
    }
    else
    {
      alert('Failed: You can donate upto '+availableCoins+' coins to this partner. Please check your amount.');
    }
    }
  }

  ngOnInit() {
     this.route.params.subscribe(params => {
       this.pid = params['pid']; 
       this.sid = params['sid']; 
       if(this.pid && this.sid)
       {
         if(this.uid==this.sid)
         {
           this.showEdit=true;
         }else
         {
           firebase.database().ref().child('/userData/'+this.uid+'/coins/'+this.sid).on('value', (coins_snapshot)=> {
              if(coins_snapshot.val())
              {
                this.showDonateCoins=true;
                this.availableCoins=coins_snapshot.val()['amount'];
                this.donationamount=this.availableCoins;
              }
              else
              this.showDonateCoins=false;
            });
         }
         
          firebase.database().ref('/userData/'+this.sid+'/myPartners/'+this.pid).once('value', (snapshot1)=> {
            console.log("myPartners");
            console.log(snapshot1.val());
            if(snapshot1.val())
            {
              let data=snapshot1.val();
              data.sliderImages_array=[];
              data.coinsReceived=0;
                  if(data.sliderImages)
                   for(let imgKey in data.sliderImages)
                     data.sliderImages_array.push(data.sliderImages[imgKey].url);
                  this.partnerUser=data;
             
            }
          });
          firebase.database().ref('/userData/'+this.pid+'/donation/').once('value', (snapshot1)=> {
            if(snapshot1.val())
            {
              for(let key in snapshot1.val())
              if(snapshot1.val()[key]['superUserId']==this.sid)
                this.partnerUser.coinsReceived=this.partnerUser.coinsReceived+parseInt(snapshot1.val()[key].amount);
            }
            
          });
       }
      
    });
  }
}
