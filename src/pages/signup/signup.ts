import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfilePage } from '../../pages/profile/profile';
import { LoginPage } from '../../pages/login/login';
import { AuthProvider } from '../../providers/auth/auth';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

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
    * @method signup
    * @return void
    */
   signup(): void
   {
      let email      : any        = this.form.controls['email'].value,
          password   : any        = this.form.controls['password'].value;

      this._AUTH.signupWithEmailAndPassword(email, password)
      .then((auth : any) =>
      {
        var uid = auth.uid;
        var ref = firebase.database().ref('/');
        ref.child('users/' + uid);
        var userRef = ref.child('users/' + uid);
        userRef.set({
          name: "Goldie",
          gender: "Female",
          age: 23,
          image: "",
          resume: ""
        });

         this.navCtrl.setRoot(ProfilePage);
      })
      .catch((error : any) =>
      {
        console.log(error.message);
      });
   }

   login(): void {
     this.navCtrl.setRoot(LoginPage);
   }
}
