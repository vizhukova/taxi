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
import {GatherOrder} from "../../providers/order/gather_order";
import {MapProvider} from "../../providers/map/map";
import {MapState} from "../../interfaces/map";

declare var cordova:any;

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
  state: MapState;
  direction: string;
  status: Object;

  pathStatus: boolean;

  cost: any;

  constructor(private nav: NavController,
              private NavProvider: Nav,
              private MapProvider: MapProvider,
              private AuthProvider: Auth,
              private PlaceProvider: Place,
              private CostProvider: Cost,
              private CarOptionsProvider: CarOptions,
              private GatherOrderProvider: GatherOrder) {
    this.nav = nav;
    this.activeTab = 'home';
    this.activeTabSet = 'main';

    this.status = {
      from: 'определение адреса подачи такси',
      to: 'определение адреса поездки',
    };

    setTimeout(() => {
      if(cordova && cordova.plugins && cordova.plugins.locationAccuracy){
        if(cordova){
          cordova.plugins.locationAccuracy.canRequest(function(canRequest){
            if(canRequest){
              cordova.plugins.locationAccuracy.request(function(){
                console.log("Successfully made request to invoke native Location Services dialog");
              }, function(){
                console.error("Failed to invoke native Location Services dialog");
              });
            }
          });
        }
      }
    }, 300);



    NavProvider.tab$.subscribe(tab => {
      this.activeTab = tab;
    });

    MapProvider.state$.subscribe(newState => {
      this.state = newState
    });

    NavProvider.tabSet$.subscribe(tabSet => {
      this.activeTabSet = tabSet;
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
      active: this.activeTab === active
    }
  }

  ngAfterViewInit(){
    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }

    this.PlaceProvider.changePathStatus(false);
  }

  makeOrder() {

    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{

      this.GatherOrderProvider.createOrder().then(() => {
        this.nav.push(Loader);
      }).catch((err) => {
        console.log(err.stack)
      });

    }
    
  }
}
