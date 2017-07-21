import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./donatecoins.scss';
import {Router,ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
declare var google:any;
@Component({
  selector: 'donatecoins',
  templateUrl: './donatecoins.html',
})
export class Donatecoins {
  public email:any;
  public uid:any;
  public name:any;
  public prifleImage:any;
  public id:any;
  public partnerUsers:any=[];
  public amount:any=[]; //this field is used for ng model of amount input
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
  
  ngOnInit() {
     this.partnerUsers=[];
         firebase.database().ref('/userData/'+this.uid+'/coins').once('value', (snapshot1)=> {
         
          console.log('snapshot1.val()');
          console.log(snapshot1.val());
            if(snapshot1.val())
            {
              for(let key in snapshot1.val())
              {
                this.getUserData(key,snapshot1.val()[key]['amount']);
              }
            }
         });     
    
  }
  donate(amount,partner_id,availableCoins,superUserId)
  {
    console.log(amount);
    console.log(partner_id);
    if(amount<=availableCoins)
    {
      document.getElementById('input-donate-'+partner_id).style.display="none";
      document.getElementById('btn-donate-'+partner_id).style.display="none";
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
           firebase.database().ref('/userData/'+partner_id+'/notifications').push({status:'unread',text:"You have received "+amount+" coins from "+this.email,timestamp:firebase.database.ServerValue.TIMESTAMP,type:'auto',noAction:true});
           alert("Thank You for Making the Difference");
           this.amount[partner_id]='';
           this.ngOnInit();

        });
    }
    else
    {
      alert('Failed: You can donate upto '+availableCoins+' coins to this partner. Please check your amount.');
    }
  }
  getUserData(id,amount)
  {
    firebase.database().ref('/userData/'+id+'/myPartners').once('value', (snapshot1)=> {
            console.log("myPartners");
            console.log(snapshot1.val());
            if(snapshot1.val())
            {
              for(let key in snapshot1.val())
              {
                  let data=snapshot1.val()[key];
                  data.uid=key;
                  data.superUserId=id;
                  data.amount=amount;
                  this.partnerUsers.push(data);
              }
             
            }
          });
          console.log(this.partnerUsers);
  }
}
