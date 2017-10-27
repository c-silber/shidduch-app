import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { AuthProvider } from '../../providers/auth/auth';
import { Platform } from 'ionic-angular';

//import * as firebase from 'firebase';

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

   constructor(public navCtrl: NavController, private _FB : FormBuilder, private _AUTH: AuthProvider)
   {

      // Define FormGroup object using Angular's FormBuilder
      this.form = this._FB.group({
         'firstName': ['', Validators.required],
         'lastName': ['', Validators.required],
         'birthdate': ['', Validators.required],
         'gender': ['', Validators.required],
      });
   }
   uploadProfile(): void
   {
      let firstName: any= this.form.controls['firstName'].value,
          lastName: any= this.form.controls['lastName'].value,
          birthdate: any= this.form.controls['birthdate'].value,
          gender: any= this.form.controls['gender'].value;

    }

}
