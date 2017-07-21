import { Injectable } from '@angular/core';
import firebase from 'firebase';
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AuthService {
public fireAuth: any;
public userData: any;




constructor() {
  this.fireAuth = firebase.auth();
  this.userData = firebase.database().ref('/userData');  

}

//login()
doLogin(email: string, password: string): any {
  return this.fireAuth.signInWithEmailAndPassword(email, password) .then((res) => {
       console.log(res);
     
    });
}
//register employeesuser()
register(email: string,  password: string,  name: string,  cpf: string,  birthdate: string): any {
       console.log("name======",name);
  return this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then((newUser) => {
      console.log(newUser);
      newUser.sendEmailVerification(); 
      
      this.userData.child(newUser.uid).set(
        {
          email:email,
          name:name,
          cpf:cpf,
          birthdate:birthdate,
        });
      var ref2 = firebase.database().ref('/unregisteredUser/connections');    
      var query = ref2.orderByChild('invitationTo').equalTo(email);
      query.once('value', (snapshot1)=> {

        for(let k in snapshot1.val())
        {
           
          firebase.database().ref('/userData').child(newUser.uid).child('/invitations').child(snapshot1.val()[k]['senderId']).update(
          {

            inviteFrom:snapshot1.val()[k]['senderEmail']

          }).then((success) => {
                  console.log("success==",success);
              this.userData.child(snapshot1.val()[k]['senderId']).child('/connections').child(newUser.uid).update(
              {

                  contact:snapshot1.val()[k]['invitationTo'],
                  status:"pending"

              });
              //notification to user
              
              firebase.database().ref('/userData/'+newUser.uid+'/notifications').push({status:'unread',text:"You have received invitation from "+snapshot1.val()[k]['senderEmail'],timestamp:snapshot1.val()[k]['timestamp'],connection_request:'true',type:'auto'});

             
              firebase.database().ref('/unregisteredUser/connections/'+k).remove();

            }).catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });
        }
      });
      var ref2 = firebase.database().ref('/unregisteredUser/superUsers');    
      var query = ref2.orderByChild('email').equalTo(email);
      query.once('value', (snapshot1)=> {
        if(snapshot1.val())
        for(let k in snapshot1.val())
        {
          firebase.database().ref('/userData/'+newUser.uid).update({superuser:true,cpf:snapshot1.val()[k].cpf,company:snapshot1.val()[k].company});
          firebase.database().ref('/unregisteredUser/superUsers/'+k).remove();
        }
      });
       var ref2 = firebase.database().ref('/unregisteredUser/partnerUsers');    
      var query = ref2.orderByChild('email').equalTo(email);
      query.once('value', (snapshot1)=> {
        if(snapshot1.val())
        for(let k in snapshot1.val())
        {
          firebase.database().ref('/userData/'+newUser.uid).update({cpf:snapshot1.val()[k].cpf});
          firebase.database().ref('/userData/'+newUser.uid+'/partnerWith/'+snapshot1.val()[k].addById).update({email:snapshot1.val()[k]['addedBy'],uid:snapshot1.val()[k]['addById'],name:snapshot1.val()[k]['addByName'],timestamp:snapshot1.val()[k]['timestamp']});
          let data={email:email,uid:newUser.uid,name:name,timestamp:snapshot1.val()[k]['timestamp'],fullDescription:'',shortDescription:'',contactInformation:''};
          if(snapshot1.val()[k]['fullDescription'])
           data.fullDescription=snapshot1.val()[k]['fullDescription'];
           if(snapshot1.val()[k]['shortDescription'])
           data.fullDescription=snapshot1.val()[k]['shortDescription'];
           if(snapshot1.val()[k]['contactInformation'])
           data.fullDescription=snapshot1.val()[k]['contactInformation'];
          
          firebase.database().ref('/userData/'+snapshot1.val()[k]['addById']+'/myPartners/'+newUser.uid).update(data);
          firebase.database().ref('/unregisteredUser/partnerUsers/'+k).remove();
        }
      });
      var ref2 = firebase.database().ref('/unregisteredUser/coins');    
      var query = ref2.orderByChild('clientEmail').equalTo(email);
      query.once('value', (snapshot1)=> {
        if(snapshot1.val())
        for(let k in snapshot1.val())
        {
          let coins=parseInt(snapshot1.val()[k]['amount']);
          firebase.database().ref('/userData/'+newUser.uid+'/coins/'+snapshot1.val()[k]['addById']).update({amount:coins});
          firebase.database().ref('/userData/'+newUser.uid+'/notifications').push({status:'unread',text:"You have received "+coins+" coins from "+snapshot1.val()[k]['addedBy'],timestamp:snapshot1.val()[k]['timestamp'],type:'auto',noAction:true});

          
          firebase.database().ref('/unregisteredUser/coins/'+k).remove();
        }
      });

  });
}

//resetpassword
resetPassword(email: string): any {
  return this.fireAuth.sendPasswordResetEmail(email);
}

//logout
doLogout(): any {
   localStorage.clear();
  return this.fireAuth.signOut();
}

}
