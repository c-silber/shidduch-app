import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,  private _AUTH: AuthProvider ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage  },
      { title: 'Settings', component: SettingsPage },
      { title: 'Logout', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page : any) : void {
    // Ensure we can log out of Firebase and reset the root page
      if(page == 'Logout')
      {
         this._AUTH.logOut()
         .then((data : any) =>
         {
            this.nav.setRoot(page.component);
         })
         .catch((error : any) =>
         {
            console.dir(error);
         });
      }

      // Otherwise reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      else
      {
         this.nav.setRoot(page.component);
      }
   }
}
