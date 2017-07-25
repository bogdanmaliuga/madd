import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./superuser.scss';
import {Router, ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
declare var google: any;
@Component({
  selector: 'superuser',
  templateUrl: './superuser.html',
})
export class Superuser {
  public email: any;
  public uid: any;
  public name: any;
  public prifleImage: any;
  public formdata: any = [];
  public partner: any = [];
  public showSubmit: boolean = true;
  public showSubmit1: boolean = true;
  public partnerUsers: any = [];
  public coinsUsers: any = [];
  public companyName: any;
  public sliderImages: any = [];
  public sliderImages_temp: any = [];
  constructor(fb: FormBuilder, private af: AngularFire, private router: Router, private route: ActivatedRoute, public changeDetectorRef: ChangeDetectorRef) {
    // if (!window.localStorage.getItem('loggedin')) {
    //
    //   this.router.navigate(['login']);
    // }
    this.email = localStorage.getItem('email');
    this.uid = localStorage.getItem('uid');
    this.name = localStorage.getItem('name');
    this.prifleImage = localStorage.getItem('picture');
    this.fetchMyPartners();
    this.fetchCoinsUsers();
    firebase.database().ref('/userData/' + this.uid + '/company').once('value', (company_snapshot1) => {
      this.companyName = company_snapshot1.val();
    });

  };
  fetchCoinsUsers() {

    firebase.database().ref('/madcoins').orderByChild('addedBy').equalTo(this.email).on('value', (snapshot1) => {
      // console.log("madcoins");
      this.coinsUsers = [];
      // console.log(snapshot1.val());
      if (snapshot1.val()) {
        for (let key in snapshot1.val()) {
          let data = snapshot1.val()[key];
          this.coinsUsers.push(data);
        }
        // console.log("coinsUsers");
        // console.log(this.coinsUsers);
      }
    });
  }

  fetchMyPartners() {

    firebase.database().ref('/userData/' + this.uid + '/myPartners').on('value', (snapshot1) => {
      // console.log("myPartners");
      // console.log(snapshot1.val());
      this.partnerUsers = [];
      if (snapshot1.val()) {
        for (let key in snapshot1.val()) {
          let data = snapshot1.val()[key];
          data.uid = key;
          data.registered = true;
          data.sliderImages_array = [];
          if (data.sliderImages)
            for (let imgKey in data.sliderImages)
              data.sliderImages_array.push(data.sliderImages[imgKey].url);

          this.partnerUsers.push(data);
        }

      }
    });
    firebase.database().ref('/unregisteredUser/partnerUsers/').orderByChild('addedBy').equalTo(this.email).once('value', (snapshot1) => {
      // console.log("myPartners");
      // console.log(snapshot1.val());
      if (snapshot1.val()) {
        for (let key in snapshot1.val()) {
          let data = snapshot1.val()[key];

          data.registered = false;
          this.partnerUsers.push(data);
        }

      }
    });
  }
  onPartnerSubmit() {
    if (this.partner.name) {
      if (this.partner.CPF) {
        if (this.partner.email) {


          this.showSubmit1 = false;
          var ref2 = firebase.database().ref('/userData/');
          var query = ref2.orderByChild('email').equalTo(this.partner.email);
          query.once('value', (snapshot1) => {
            if (snapshot1.val()) {
              for (var k in snapshot1.val()) {
                let data = { email: this.partner.email, uid: k, name: this.partner.name, timestamp: firebase.database.ServerValue.TIMESTAMP, fullDescription: '', shortDescription: '', contactInformation: '', madCoinsTarget: 'Unlimited' };
                if (this.partner.fullDescription)
                  data.fullDescription = this.partner.fullDescription;
                if (this.partner.shortDescription)
                  data.shortDescription = this.partner.shortDescription;
                if (this.partner.contactInformation)
                  data.contactInformation = this.partner.contactInformation;
                if (this.partner.madCoinsTarget)
                  data.madCoinsTarget = this.partner.madCoinsTarget;


                if (snapshot1.val()[k].superuser == true) {
                  alert("Failed : " + this.partner.email + "is already superuser.");
                }
                else {
                  firebase.database().ref('/userData/' + k).update({ cpf: this.partner.CPF });
                  firebase.database().ref('/userData/' + k + '/partnerWith/' + this.uid).update({ email: this.email, uid: this.uid, name: this.name, timestamp: firebase.database.ServerValue.TIMESTAMP });
                  firebase.database().ref('/userData/' + this.uid + '/myPartners/' + k).update(data);
                  if (this.sliderImages_temp.length == 0) {
                    this.showSubmit1 = true;
                    this.partner = [];
                    this.sliderImages_temp = [];
                    alert("Success: Partner added successfully.");
                  }
                  else {
                    this.uploadSliderImages(k);
                  }


                }

              }
            }
            else {

              let data = { cpf: this.partner.CPF, email: this.partner.email, addedBy: this.email, addById: this.uid, addByName: this.name, timestamp: firebase.database.ServerValue.TIMESTAMP, name: this.partner.name, fullDescription: '', shortDescription: '', contactInformation: '' };
              if (this.partner.fullDescription)
                data.fullDescription = this.partner.fullDescription;
              if (this.partner.shortDescription)
                data.shortDescription = this.partner.shortDescription;
              if (this.partner.contactInformation)
                data.contactInformation = this.partner.contactInformation;
              firebase.database().ref('/unregisteredUser/partnerUsers').push(data);
              alert("Success: Partner added successfully.");
              this.partner = [];
              this.sliderImages_temp = [];
              this.showSubmit1 = true;
            }
          });

        }
        else {
          alert("Please fill  Email");
        }
      } else {
        alert("Please fill CPF");
      }
    } else {
      alert("Please fill Name");
    }
  }
  onSubmit() {
    if (this.formdata.clientEmail) {
      if (this.formdata.amount) {
        if (this.formdata.invoiceNumber) {
          //  console.log("amount 0="+this.formdata.amount);
          this.showSubmit = false;
          var ref2 = firebase.database().ref('/userData/');
          var query = ref2.orderByChild('email').equalTo(this.formdata.clientEmail);
          query.once('value', (snapshot1) => {
            if (snapshot1.val()) {
              for (var k in snapshot1.val()) {
                firebase.database().ref('/madcoins/').push({ clientEmail: this.formdata.clientEmail, amount: this.formdata.amount, invoiceNumber: this.formdata.invoiceNumber, timestamp: firebase.database.ServerValue.TIMESTAMP, addedBy: this.email }).then(() => {
                  this.showSubmit = true;

                  // console.log("amount="+this.formdata.amount);
                  let coins = parseInt(this.formdata.amount);
                  // console.log("coins="+coins);
                  if (snapshot1.val()[k]['coins']) {
                    //  console.log(snapshot1.val()[k]['coins'][this.uid]);
                    if (snapshot1.val()[k]['coins'][this.uid])
                      coins = coins + parseInt(snapshot1.val()[k]['coins'][this.uid]['amount']);

                  }

                  firebase.database().ref('/userData/' + k + '/coins/' + this.uid).update({ amount: coins, companyName: this.companyName });
                  firebase.database().ref('/userData/' + k + '/notifications').push({ status: 'unread', text: "You have received " + this.formdata.amount + " coins from " + this.email, timestamp: firebase.database.ServerValue.TIMESTAMP, type: 'auto', noAction: true });
                  alert("Coins sent.");
                  this.formdata = [];
                });
              }
            }
            else {
              firebase.database().ref('/madcoins/').push({ clientEmail: this.formdata.clientEmail, amount: this.formdata.amount, invoiceNumber: this.formdata.invoiceNumber, timestamp: firebase.database.ServerValue.TIMESTAMP, addedBy: this.email }).then(() => {
                this.showSubmit = true;
                firebase.database().ref('/unregisteredUser/coins').push({ clientEmail: this.formdata.clientEmail, amount: this.formdata.amount, invoiceNumber: this.formdata.invoiceNumber, timestamp: firebase.database.ServerValue.TIMESTAMP, addedBy: this.email, addedById: this.uid });
                alert("Coins sent.");
                this.formdata = [];
              });
            }
          });

        }
        else {
          alert("Please fill Invoice Number");
        }
      } else {
        alert("Please fill Amount");
      }
    } else {
      alert("Please fill Client Email");
    }
  }
  uploadSliderImages(k) {

    this.sliderImages_temp.forEach((entry, index) => {
      let date = new Date().getTime();
      var mountainsRef = firebase.storage().ref().child('slider/' + k + '/' + date).put(entry);
      mountainsRef.on('state_changed', (snapshot) => {
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
      }, (error) => {
        // Handle unsuccessful uploads
        //this.uploadProgress1="Upload failed.";
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        var downloadURL = mountainsRef.snapshot.downloadURL;

        var ref = firebase.database().ref('/userData/' + this.uid + '/myPartners/' + k + "/sliderImages").push({ url: downloadURL });

        //this.uploadProgress1=false;
        this.sliderImages.push({ url: downloadURL });

        this.changeDetectorRef.detectChanges();
        if (this.sliderImages_temp.length == index + 1) {
        this.showSubmit1 = true;
          this.sliderImages_temp = [];
        }
      });
    });




  }
  onSliderChange(event) {
    let file = event.srcElement.files;
    if (file[0]) {
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
}
