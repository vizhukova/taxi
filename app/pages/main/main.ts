import { Component, ApplicationRef } from '@angular/core';

import { AccountPage } from '../../pages/account/account';
import { HomePage } from '../../pages/home/home';
import { SettingsPage } from '../../pages/settings/settings';
import { TimePage } from '../../pages/time/time';

import { SearchTabPage } from '../../pages/search-tab/search-tab';
import { TimeTabPage } from '../../pages/time-tab/time-tab';
import { FeedTabPage } from '../../pages/feed-tab/feed-tab';
import { FlyTabPage } from '../../pages/fly-tab/fly-tab';

import { TaxiPage } from '../../pages/taxi/taxi';
import { LikePage } from '../../pages/like/like';
import { MoneyPage } from '../../pages/money/money';

import {NavController} from 'ionic-angular';

import {RegistrationModal} from "../../components/registration/registration";
import {Loader} from "../../components/loader/loader";

import {Nav} from "../../providers/nav/nav";
import {Auth} from "../../providers/auth/auth";
import {Place} from "../../providers/place/place";
import {Cost} from "../../providers/cost/cost";
import {CarOptions} from "../../providers/car-options/car-options";
import {GatherOrder} from "../../providers/order/gather_order";
import {OrderHistory} from "../../providers/order/history";
import {MapProvider} from "../../providers/map/map";

import {MapState} from "../../interfaces/map";

import * as _ from 'lodash'


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
    FlyTabPage,
    TaxiPage,
    LikePage,
    MoneyPage
  ]
})
export class MainPage {


  activeTab: string;
  activeTabSet: string;
  state: MapState;
  direction: string;
  status: Object;
  cost: any;

  constructor(private nav: NavController,
              private NavProvider: Nav,
              private MapProvider: MapProvider,
              private AuthProvider: Auth,
              private PlaceProvider: Place,
              private ref: ApplicationRef,
              private CostProvider: Cost,
              private CarOptionsProvider: CarOptions,
              private GatherOrderProvider: GatherOrder,
              private OrderHistoryProvider: OrderHistory) {
    this.nav = nav;
    this.activeTab = 'home';
    this.activeTabSet = 'main';

    this.status = {
      from: 'определение адреса подачи такси',
      to: 'определение адреса поездки',
    };

    // cordova.plugins.locationAccuracy.request(
    //     (success)=>{console.log('success', success)},
    //     (error)=>{
    //       if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
    //         if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
    //           cordova.plugins.diagnostic.switchToLocationSettings();
    //         }
    //       }
    //     },
    //     cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    //
    // setTimeout(() => {
    //   if(cordova && cordova.plugins && cordova.plugins.locationAccuracy){
    //     console.log(cordova)
    //     if(cordova){
    //       cordova.plugins.locationAccuracy.canRequest(function(canRequest){
    //         if(canRequest){
    //           cordova.plugins.locationAccuracy.request(function(){
    //             console.log("Successfully made request to invoke native Location Services dialog");
    //           }, function(){
    //             console.error("Failed to invoke native Location Services dialog");
    //           });
    //         }
    //       });
    //     }
    //   }
    // }, 300);



    NavProvider.tab$.subscribe(tab => {
      this.activeTab = tab;
    });


    MapProvider.state$.subscribe(newState => {
      this.state = _.assign({}, newState);
    });

    NavProvider.tabSet$.subscribe(tabSet => {
      this.activeTabSet = tabSet;
    });

    CostProvider.cost$.subscribe(cost => {
      this.cost = cost;
      this.MapProvider.set('cost', true);
    });


    CarOptionsProvider.load()

  }

  changeTab(newTab:string) {
    if(this.state.searching || this.state.onmapsearch) {return};
    this.activeTab = newTab;
    this.ref.tick()
  }


  setClasses(active: string) {
    return {
      tab: true,
      active: this.activeTab === active,
      disabled: (this.state.searching || this.state.onmapsearch)
    }
  }

  setCallClasses() {
    this.state.tripFinished = true;
    return {
      call: true,
      active: !this.state.searching && this.state.cost && !this.state.onmapsearch && !this.state.tripFinished,
      next: this.state.onmapsearch
    };
  }  

  ngAfterViewInit(){
    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{
      this.MapProvider.set('authorized', true);
    }
  }

  makeOrder() {
    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{
      this.nav.push(Loader);

      this.GatherOrderProvider.createOrder().then((data) => {
        this.OrderHistoryProvider.save(this.GatherOrderProvider.getGatheredOrder());

        //this.NavProvider.changeTabSet('order');
        // this.state.tripFinished = true;


      }).catch((err) => {
        console.log(err.stack)
      });

    }
    
  }
}
