import { Component } from '@angular/core';

import { AccountPage } from '../../pages/account/account';
import { HomePage } from '../../pages/home/home';
import { SettingsPage } from '../../pages/settings/settings';
import { TimePage } from '../../pages/time/time';

import { SearchTabPage } from '../../pages/search-tab/search-tab';
import { TimeTabPage } from '../../pages/time-tab/time-tab';
import { FeedTabPage } from '../../pages/feed-tab/feed-tab';
import { FlyTabPage } from '../../pages/fly-tab/fly-tab';

import {NavController} from 'ionic-angular';
import {Nav} from "../../providers/nav/nav";
import {RegistrationModal} from "../../components/registration/registration";
import {Auth} from "../../providers/auth/auth";
import {Place} from "../../providers/place/place";
import {Cost} from "../../providers/cost/cost";
import {Loader} from "../../components/loader/loader";
import {CarOptions} from "../../providers/car-options/car-options";

declare var cordova:any

@Component({
  selector: 'search-page',
  templateUrl: 'build/pages/main/main.html',
  directives: [
    SettingsPage,
    HomePage,
    AccountPage,
    TimePage,
    SearchTabPage,
    TimeTabPage,
    FeedTabPage,
    FlyTabPage
  ]
})
export class MainPage {


  activeTab: string;
  activeTabSet: string;

  direction: string;
  status: Object;

  pathStatus: boolean;

  cost: any;

  constructor(private nav: NavController,
              private NavProvider: Nav,
              private AuthProvider: Auth,
              private PlaceProvider: Place,
              private CostProvider: Cost,
              private CarOptionsProvider: CarOptions) {
    this.nav = nav;
    this.activeTab = 'home';
    this.activeTabSet = 'main';

    this.direction = 'from';

    this.status = {
      from: 'определение адреса подачи такси',
      to: 'определение адреса поездки',
    };

    // if(cordova){
    //   cordova.plugins.locationAccuracy.request(function (success){
    //     console.log("Successfully requested accuracy: "+success.message);
    //   }, function (error){
    //     console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
    //     if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
    //       if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
    //         cordova.plugins.diagnostic.switchToLocationSettings();
    //       }
    //     }
    //   }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    // }



    NavProvider.tab$.subscribe(tab => {
      this.activeTab = tab;
    });

    NavProvider.tabSet$.subscribe(tabSet => {
      this.activeTabSet = tabSet;
    });

    PlaceProvider.direction$.subscribe(direction => {
      this.direction = direction;
    });

    PlaceProvider.path$.subscribe(status => {
      this.pathStatus = status;
    });

    CostProvider.cost$.subscribe(cost => {
      this.cost = cost;
    });

    CarOptionsProvider.load()

  }

  changeTab(newTab:string) {
    this.activeTab = newTab;
  }

  setClasses(active: string) {
    return {
      tab: true,
      active: this.activeTab === active,
    }
  }

  ngAfterViewInit(){
    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{
      this.PlaceProvider.changePathStatus(false)
    }
  }

  makeOrder() {

    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{
      this.nav.push(Loader);
    }
    
  }
}
