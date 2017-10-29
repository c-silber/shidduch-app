import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../../pages/home/home';
import { ProfilePage } from '../../pages/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
   /**
    * Create reference for FormGroup object
    */
   public form: FormGroup;

   constructor(public navCtrl    : NavController,
               private _FB       : FormBuilder,
               private _AUTH     : AuthProvider)
   {
      // Define FormGroup object using Angular's FormBuilder
      this.form = this._FB.group({
         'email'        : ['', Validators.required],
         'password'     : ['', Validators.required]
      });
   }

   /**
    * Log in using the loginWithEmailAndPassword method
    * from the AuthProvider service (supplying the email
    * and password FormControls from the template via the
    * FormBuilder object
    * @method logIn
    * @return void
    */
   logIn(): void
   {
      let email      : any        = this.form.controls['email'].value,
          password   : any        = this.form.controls['password'].value;

      this._AUTH.loginWithEmailAndPassword(email, password)
      .then((auth : any) =>
      {
        var uid = auth.uid;
        var ref = firebase.database().ref('/');
        ref.child('users/' + uid);
        var userRef = ref.child('users/' + uid);
        console.log(userRef);
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error : any) =>
      {
        console.log(error.message);
      });
   }

   signup(): void {
     this.navCtrl.setRoot(ProfilePage);
   }


}
