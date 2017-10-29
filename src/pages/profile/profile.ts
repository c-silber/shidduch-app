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

//import * as firebase from 'firebase';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   /**
    * Create reference for FormGroup object
    */
   public form: FormGroup;

   constructor(public navCtrl: NavController, private _FB : FormBuilder, private _AUTH: AuthProvider,
     private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
     public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
     public platform: Platform, public loadingCtrl: LoadingController)
   {
      // Define FormGroup object using Angular's FormBuilder
      this.form = this._FB.group({
         'firstName': ['', Validators.required],
         'lastName': ['', Validators.required],
         'birthdate': ['', Validators.required],
         'gender': ['', Validators.required],
         'month': ['', Validators.required],
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

    public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  public uploadImage() {
      // Destination URL
      var url = "http://yoururl/upload.php";

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      var filename = this.lastImage;

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename}
      };

      const fileTransfer: TransferObject = this.transfer.create();

      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        this.loading.dismissAll()
        this.presentToast('Image succesful uploaded.');
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while uploading file.');
      });
    }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
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

}
