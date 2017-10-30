import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { AuthProvider } from '../../providers/auth/auth';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import * as firebase from 'firebase';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   public myPhotosRef: any;
   public myPhoto: any;
   public myPhotoURL: any;

   /**
    * Create reference for FormGroup object
    */
   public form: FormGroup;

   constructor(public navCtrl: NavController, private _FB : FormBuilder, private _AUTH: AuthProvider, private camera : Camera)
   {
     // ref to photos storage location
     this.myPhotosRef = firebase.storage().ref('/Photos/');
      // Define FormGroup object using Angular's FormBuilder
      this.form = this._FB.group({
         'firstName': ['', Validators.required],
         'lastName': ['', Validators.required],
         'birthdate': ['', Validators.required],
         'gender': ['', Validators.required],
         'month': ['', Validators.required]

      });
   }
   uploadProfile(): void
   {
      let firstName: any= this.form.controls['firstName'].value,
          lastName: any= this.form.controls['lastName'].value,
          birthdate: any= this.form.controls['birthdate'].value,
          gender: any= this.form.controls['gender'].value,
          month: any= this.form.controls['month'].value;

    }
    selectPhoto(): void {
        this.camera.getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          quality: 100,
          encodingType: this.camera.EncodingType.PNG,
        }).then(imageData => {
          this.myPhoto = imageData;
          this.uploadPhoto();
        }, error => {
          console.log("ERROR -> " + JSON.stringify(error));
        });
      }

      takePhoto() {
        this.camera.getPicture({
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.PNG,
          saveToPhotoAlbum: true
        }).then(imageData => {
          this.myPhoto = imageData;
          this.uploadPhoto();
        }, error => {
          console.log("ERROR -> " + JSON.stringify(error));
        });
      }

      private uploadPhoto(): void {
          this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
            .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
            .then((savedPicture) => {
              this.myPhotoURL = savedPicture.downloadURL;
            });
        }

        private generateUUID(): any {
          var d = new Date().getTime();
          var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
          return uuid;
        }
}
