import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./admin.scss';
import {Router,ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
declare var google:any;
@Component({
  selector: 'admin',
  templateUrl: './admin.html',
})
export class Admin {
  public email:any;
  public uid:any;
  public name:any;
  public prifleImage:any;
  public superUsers:any=[];
  public sUserForm:any=[];
  public showSubmit1:boolean=true;
  constructor(fb:FormBuilder,private af: AngularFire,private router: Router,private route: ActivatedRoute, public changeDetectorRef: ChangeDetectorRef) {
  if(!window.localStorage.getItem('loggedin'))
        { 
        
          this.router.navigate(['login']);
        }
    this.email= localStorage.getItem('email');
    this.uid=localStorage.getItem('uid');
    this.name=localStorage.getItem('name');
    this.prifleImage=localStorage.getItem('picture');

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
              this.superUsers.push(data);
          }
          console.log('superUsers');
          console.log(this.superUsers);
        }
      });
      firebase.database().ref('/unregisteredUser/superUsers/').on('value', (snapshot1)=> {
        if(snapshot1.val())
        {
          for(let key in snapshot1.val())
          {
              let data=snapshot1.val()[key];
              data.uid=key;
              data.registered=false;
              this.superUsers.push(data);
          }
        }
      });

  };
  onSUserSubmit()
  {
    if(this.sUserForm.name)
    {
      if(this.sUserForm.CNPJ)
      {
        if(this.sUserForm.email)
        {
           if(this.sUserForm.company)
         {
          
          this.showSubmit1=false;
          var ref2 = firebase.database().ref('/userData/');    
            var query = ref2.orderByChild('email').equalTo(this.sUserForm.email);
            query.once('value', (snapshot1)=> {
            if(snapshot1.val())
            {
              for(var k in snapshot1.val())
              {
                  this.showSubmit1=true;
                  if(snapshot1.val()[k].superuser==true)
                  {
                      alert("Failed : "+this.sUserForm.email+ "is already superuser.");
                  }
                  else
                  {
                      firebase.database().ref('/userData/'+k).update({superuser:true,CNPJ:this.sUserForm.CNPJ,company:this.sUserForm.company});
                      alert("Success: Superuser added successfully.");
                      this.sUserForm=[];
                  }
                  
              }
            }
            else
            {
                 firebase.database().ref('/unregisteredUser/superUsers').push({CNPJ:this.sUserForm.CNPJ,company:this.sUserForm.company,email:this.sUserForm.email,addedBy:this.email,timestamp:firebase.database.ServerValue.TIMESTAMP,name:this.sUserForm.name});
                      alert("Success: Superuser added successfully.");
                      this.sUserForm=[];
            }
            });
          } 
        else
        {
          alert("Please fill Company");
        }
        } 
        else
        {
          alert("Please fill  Email");
        }
      }else
        {
          alert("Please fill CNPJ");
        } 
    }else
        {
          alert("Please fill Name");
        }
  }
 
}
