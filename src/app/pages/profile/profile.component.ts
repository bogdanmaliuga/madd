import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import 'style-loader!./profile.scss';
import {Router, ActivatedRoute} from '@angular/router';
import { AngularFire, FirebaseObjectObservable, AngularFireDatabase, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';
declare var google: any;
@Component({
  selector: 'profile',
  templateUrl: './profile.html',
})
export class Profile {
  public sUserDash: boolean = false;
  public user:any ;
  public email: any;
  public uid: any;
  public name: any;
  public uploadProgress: any;
  public uploadProgress1: any;
  public uploadProgressIndex: any;
  public fullDescription: any;
  public shortDescription: any;
  public gender: any;
  public prifleImage: any;
  public file: any;
  public showSubmit: any = true;
  public fullAddress: Object;
  public address: Object;
  public autocomplete: any;
  public sliderImages: any = [];
  public sliderImages_temp: any = [];

  constructor(fb: FormBuilder, private af: AngularFire, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute, public changeDetectorRef: ChangeDetectorRef) {
    if (!window.localStorage.getItem('loggedin')) {
      this.router.navigate(['login']);
    }

    // this.email = localStorage.getItem('email');
    this.uid = localStorage.getItem('uid');
    this.name = localStorage.getItem('name');
    this.prifleImage = localStorage.getItem('picture');
    const path = 'userData/'+this.uid;
    db.object(path).subscribe(snapshot => {
      this.user=snapshot;
      this.fullAddress={
        address:this.user.address,
        location:this.user.location
      }
      // this.fullAddress['address']=this.user.address;
      // this.fullAddress['location']=this.user.location;
    });
    // firebase.database().ref("userData/" + localStorage.getItem('uid') + '/gender').once('value', (gender) => {
    //   if (gender.val())
    //     this.gender = gender.val();
    // });
    firebase.database().ref("userData/" + localStorage.getItem('uid') + '/email').once('value', (email) => {
      if (email.val())

        this.email = email.val();
    });
    firebase.database().ref().child('/userData/' + this.uid + '/superuser').once('value', (superuser_snapshot) => {
      if (superuser_snapshot.val() == true)
        this.sUserDash = true;
      else
        this.sUserDash = false;
    });
    // firebase.database().ref("userData/" + localStorage.getItem('uid') + '/address').once('value', (address) => {
    //   if (address.val())
    //     this.address = address.val();
    // });
    firebase.database().ref("userData/" + localStorage.getItem('uid') + '/fullDescription').once('value', (fullDescription) => {
      if (fullDescription.val())
        this.fullDescription = fullDescription.val();
    });
    firebase.database().ref("userData/" + localStorage.getItem('uid') + '/shortDescription').once('value', (shortDescription) => {
      if (shortDescription.val())
        this.shortDescription = shortDescription.val();
    });
    firebase.database().ref("userData/" + localStorage.getItem('uid') + '/sliderImages').once('value', (sliderImages) => {
      if (sliderImages.val())
        for (let key in sliderImages.val()) {
          let d = key;
          this.sliderImages.push(sliderImages.val()[key]);
        }

    });
    setTimeout(() => {
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('googleplace_auto_user_address'), {});
      google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
        var place = this.autocomplete.getPlace();
        this.address = place['formatted_address'];
        var location = place['geometry']['location'];
        var lat = location.lat();
        var lng = location.lng();
        this.fullAddress = { address: place['formatted_address'], location: lat + ',' + lng }

      });
    }, 1000);
  };
  onSubmit() {
    this.showSubmit = false;
    let data = { gender: '', address: '', location: '', fullDescription: '', shortDescription: '' };
    let userUpdate={
      address:this.fullAddress.address,
      location:this.fullAddress.location,
      gender:this.user.gender,
      name:this.user.name,
      fullDescription:this.user.fullDescription,
      shortDescription:this.user.shortDescription
    }
    
    setTimeout(() => {
      console.log(this.user);
      firebase.database().ref("/userData/" + this.uid + "/").update( userUpdate)
    }, 2000);
    if (this.file) {
      var mountainsRef = firebase.storage().ref().child('profiles/' + this.uid).put(this.file[0]);
      mountainsRef.on('state_changed', (snapshot) => {

        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        this.uploadProgress = "Upload failed.";
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        var downloadURL = mountainsRef.snapshot.downloadURL;
        var ref = firebase.database().ref("/userData/" + this.uid + "/").update({ picture: downloadURL });

        this.uploadProgress = false;
        this.prifleImage = downloadURL;
        localStorage.setItem('picture', downloadURL);
        this.changeDetectorRef.detectChanges();
        if (this.sliderImages_temp.length == 0) {
          this.showSubmit = true;
        }
        else {
          this.uploadSliderImages();
        }
      });

    }
    else {

      if (this.sliderImages_temp.length == 0) {
        this.showSubmit = true;
      }
      else {
        this.uploadSliderImages();
      }
    }

  }
  uploadSliderImages() {

    this.sliderImages_temp.forEach((entry, index) => {
      let date = new Date().getTime();
      var mountainsRef = firebase.storage().ref().child('slider/' + this.uid + '/' + date).put(entry);
      mountainsRef.on('state_changed', (snapshot) => {
        this.uploadProgressIndex = index;
        this.uploadProgress1 = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        this.uploadProgress1 = "Upload failed.";
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        var downloadURL = mountainsRef.snapshot.downloadURL;
        var ref = firebase.database().ref("/userData/" + this.uid + "/sliderImages").push({ url: downloadURL });

        this.uploadProgress1 = false;
        this.sliderImages.push({ url: downloadURL });

        this.changeDetectorRef.detectChanges();
        if (this.sliderImages_temp.length == index + 1)
        { this.showSubmit = true; }
      });
    });




  }

  onChange(event) {
    this.uploadProgress = 0;
    this.file = event.srcElement.files;
    if (this.file[0]) {
      if (this.file[0].size <= 2228571) {
      }
      else {
        alert("File size must be less than 2MB.");
      }
    }

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
