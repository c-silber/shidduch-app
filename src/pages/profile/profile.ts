import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../../pages/home/home';
import { AuthProvider } from '../../providers/auth/auth';

import { Camera } from '@ionic-native/camera';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   public myPhotosRef: any;
   public myPhoto: any;
   public myPhotoURL: any;
   lastImage: string = null;
   loading: Loading;

   /**
    * Create reference for FormGroup object
    */
   public form: FormGroup;

   constructor(public navCtrl: NavController, private _FB : FormBuilder, private _AUTH: AuthProvider,
     public actionSheetCtrl: ActionSheetController,
     private camera : Camera, public toastCtrl: ToastController, public loadingCtrl: LoadingController)
   {
     // ref to photos storage location
     this.myPhotosRef = firebase.storage().ref('/Photos/');
      // Define FormGroup object using Angular's FormBuilder
      this.form = this._FB.group({
         'firstName': ['', Validators.required],
         'lastName': ['', Validators.required],
         'birthdate': ['', Validators.required],
         'gender': ['', Validators.required],
         'month': ['', Validators.required],
         'pocName': ['', Validators.required],
         'pocRelation': ['', Validators.required],
         'pocContact': ['', Validators.required]
      });
   }
   uploadProfile(): void
   {
      let firstName: any= this.form.controls['firstName'].value,
          lastName: any= this.form.controls['lastName'].value,
          birthdate: any= this.form.controls['birthdate'].value,
          gender: any= this.form.controls['gender'].value,
          photo: any= this.myPhotoURL,
          pocName: any= this.form.controls['pocName'].value,
          pocRelation: any= this.form.controls['pocRelation'].value,
          pocContact: any= this.form.controls['pocContact'].value;

      this._AUTH.addUserProfile(firstName, lastName, birthdate, gender, photo, pocName, pocRelation, pocContact);

      this.navCtrl.setRoot(HomePage);
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Select Image Source',
          buttons: [
            {
              text: 'Load from Library',
              handler: () => {
                this.selectPhoto();
              }
            },
            {
              text: 'Use Camera',
              handler: () => {
                this.takePhoto();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });
        actionSheet.present();
      }

    selectPhoto(): void {
        this.camera.getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          quality: 100,
          encodingType: this.camera.EncodingType.PNG,
        }).then(imageData => {
          this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
          });
          this.loading.present();
          this.myPhoto = imageData;
          this.uploadPhoto();
          this.loading.dismissAll();
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
          this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
          });
          this.loading.present();
          this.myPhoto = imageData;
          this.uploadPhoto();
        }, error => {
          this.presentToast("ERROR -> " + JSON.stringify(error));
        });
      }

      private presentToast(text) {
        let toast = this.toastCtrl.create({
          message: text,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }

      private uploadPhoto(): void {
         this.myPhotosRef.child(this.generateUUID())
            .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
            .then((savedPicture) => {
              this.loading.dismissAll();
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
