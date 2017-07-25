import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import 'style-loader!../login/login.scss';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
@Component({
  selector: 'components',
  templateUrl: './component.html'
})
export class Components {

  public form:FormGroup;
  public restaurante:AbstractControl;
  public submitted:boolean = false;
  public myprojects:any=[];
  public email:any;
  public uid:any;
  item:any;
  allmyproject:any = [];
  projects:any=[];
  public myAcceptedTaskProjects:any;
   constructor(fb:FormBuilder, private router: Router,  af: AngularFire)
   {
  if(!window.localStorage.getItem('loggedin'))
        {

          this.router.navigate(['login']);
        }
                this.email= localStorage.getItem('email');
                this.uid= localStorage.getItem('uid');
                // console.log(this.email);
                var ref2 = firebase.database().ref().child('/projectData/');
                      var query = ref2.orderByChild('createdBy').equalTo(this.email);

                        query.once('value', (snapshot1)=> {
                            // console.log(snapshot1.val());
                          for(var k in snapshot1.val())
                            {
                              var d=snapshot1.val()[k];
                              d.id=k;
                              // console.log(this.myprojects);
                              this.myprojects.push(d);
                              // console.log(d);
                            }


                        });

                      var ref3 = firebase.database().ref().child('/userData/'+this.uid+'/acceptedTasks');

                        ref3.once('value', (snapshot1)=> {

                          for(var k in snapshot1.val())
                            {
                              var d=snapshot1.val()[k];
                              this.myprojects.push(d);

                            }


                        });

 	}



      pdetails(data)
      {
       console.log("data====",data);
       var id;
       if(data.id)
        id=data.id;
       if(data.projectId)
       id=data.projectId;
       this.router.navigate(['pages/projectdetails/',id]);
      }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
    }
  }

}
