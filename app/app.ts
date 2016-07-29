import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import { HomePage } from './pages/home/home';
import { SettingsPage } from './pages/settings/settings';
import { TimePage } from './pages/time/time';
import { AccountPage } from './pages/account/account';
import { SearchPage } from './pages/search/search';
import { IndexPage } from './pages/index/index';
import {Place} from './providers/place/place';
import {RideProvider} from "./providers/ride";

@Component({
  template: `
    <ion-tabs>
      <ion-tab tabIcon="locate" [root]="home"></ion-tab>
      <ion-tab tabIcon="options" [root]="settings"></ion-tab>
      <ion-tab tabIcon="clock" [root]="time"></ion-tab>
      <ion-tab tabIcon="person" [root]="account"></ion-tab>
    </ion-tabs>
`})
export class MyApp {
  
  home: any = HomePage;
  settings: any = SettingsPage;
  time: any = TimePage;
  account: any = AccountPage;



  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }


}
//
//const routes: RouterConfig = [
//  { path: '', pathMatch: 'full', redirectTo: '/home'},
//  { path: 'home', component: MyApp },
//  { path: 'search', component: SearchPage }
//];

//noinspection TypeScriptValidateTypes
ionicBootstrap(MyApp, [
  Place,
  RideProvider
], {
  tabbarPlacement: 'top',
  platforms: {
    ios: {
      tabbarPlacement: 'top'
    }
  }
});
