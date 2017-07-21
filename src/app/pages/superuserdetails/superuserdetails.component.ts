import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./superuserdetails.scss';
import {Router,ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';

import firebase from 'firebase';
declare var google:any;

@Component({
  selector: 'superuserdetails',
  templateUrl: './superuserdetails.html',
})
export class Superuserdetails {
  public email:any;
  public uid:any;
  public name:any;
  public prifleImage:any;
  public id:any;
  public partnerUsers:any=[];
  public superUserDetails:any={};
  public sliderImages:any=[];
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
     this.route.params.subscribe(params => {
       this.id = params['id']; 
       if(this.id)
       {
         
          firebase.database().ref('/userData/'+this.id).once('value', (snapshot1)=> {
          this.superUserDetails=snapshot1.val();
          console.log(this.superUserDetails);
           for(let key in this.superUserDetails['sliderImages'])
            {
              let d=key;
              this.sliderImages.push(this.superUserDetails['sliderImages'][key]);
            }
        });
          firebase.database().ref('/userData/'+this.id+'/myPartners').once('value', (snapshot1)=> {
            console.log("myPartners");
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
                  this.partnerUsers.push(data);
              }
             
            }
          });
          firebase.database().ref('/unregisteredUser/partnerUsers/').orderByChild('addedBy').equalTo(this.email).once('value', (snapshot1)=> {
            console.log("myPartners");
            console.log(snapshot1.val());
            if(snapshot1.val())
            {
              for(let key in snapshot1.val())
              {
                  let data=snapshot1.val()[key];
                 
                  data.registered=false;
                  this.partnerUsers.push(data);
              }
            
            }
          });
       }
      
    });
  }
}
