import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./login.scss';
import {Router} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login {
  item:FirebaseObjectObservable<any>;
  user:any;
  errorMessage:any;
  public emailNotVerified:any;
  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  public error:any;
  public userData:any;
  public successData:any;
  constructor(fb:FormBuilder,private af: AngularFire,private router: Router) {
    if(window.localStorage.getItem('loggedin')=='true')
    {

         this.router.navigate(['pages/dashboard']);
    }


    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    // this.af.auth.subscribe(auth => {
    //   console.log(auth);
    //   if(auth)
    //   {
    //     this.item = af.database.object('/users/'+auth['uid'], { preserveSnapshot: true });
    //     this.item.subscribe(snapshot => {
    //       console.log(snapshot.val());
    //       this.user=snapshot.val();
    //        window.localStorage.setItem('user',JSON.stringify(this.user));
    //        this.router.navigate(['pages/dashboard']);
    //    });
    //   }

    // });
    this.userData = firebase.database().ref('/userData');
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
       console.log(values);

       this.af.auth.login({
          email: values['email'],
          password: values['password']
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        }).then((success) => {
        console.log(success);
        this.successData=success;
        if(success.auth.emailVerified)
        {
          console.log("=====",success);
           this.item = this.af.database.object('/userData/'+success.uid, { preserveSnapshot: true });
           this.item.subscribe(snapshot => {
           console.log("snapshot.val()",snapshot.val());
           window.localStorage.setItem('loggedin','true');
           localStorage.setItem('loggedin','true');

           localStorage.setItem('name',snapshot.val().name);
           localStorage.setItem('email',snapshot.val().email);
           localStorage.setItem('uid',success.uid);
           this.router.navigate(['pages/dashboard']);
           window.location.reload(false);
         });

          console.log("Firebase success: " + JSON.stringify(success));
        }
        else
          {
            this.emailNotVerified=true;
            this.submitted = false;
          }
        })
        .catch((error) => {
        alert(error['message']);

        this.submitted=false;
          this.errorMessage=error['message'];
          console.log("Firebase failure: " + JSON.stringify(error));
        });


    }
  }
resend()
{
  this.successData.auth.sendEmailVerification();
  this.password=null;
  this.emailNotVerified=false;
  alert("Verification email sent.");
}

   loginFb() {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    }).then(
        (success) => {
        console.log(success);
          window.localStorage.setItem('loggedin','true');
           localStorage.setItem('loggedin','true');
        this.router.navigate(['pages/dashboard']);
      }).catch(
        (err) => {
        this.error = err;
        console.log(this.error);
      })
  }

    loginGoogle() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    }).then(
        (success) => {
       console.log(success);
         window.localStorage.setItem('loggedin','true');
           localStorage.setItem('loggedin','true');
           localStorage.setItem('name',success.auth.displayName);
           localStorage.setItem('email',success.auth.email);
          this.userData.child(success.uid).set(
          {
            email:success.auth.email,
            name:success.auth.displayName
          });

       this.router.navigate(['pages/dashboard']);
      }).catch(
        (err) => {
        this.error = err;
          console.log(this.error);
      })
  }
}
