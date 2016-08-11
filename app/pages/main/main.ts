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

import {RegistrationModal} from "../../components/registration/registration";
import {Loader} from "../../components/loader/loader";

import {Nav} from "../../providers/nav/nav";
import {Auth} from "../../providers/auth/auth";
import {Place} from "../../providers/place/place";
import {Cost} from "../../providers/cost/cost";
import {CarOptions} from "../../providers/car-options/car-options";
import {GatherOrder} from "../../providers/order/gather_order";
import {OrderHistory} from "../../providers/order/history";

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

  direction: string;
  status: Object;

  pathStatus: boolean;

  cost: any;

  constructor(private nav: NavController,
              private NavProvider: Nav,
              private AuthProvider: Auth,
              private PlaceProvider: Place,
              private CostProvider: Cost,
              private CarOptionsProvider: CarOptions,
              private GatherOrderProvider: GatherOrder,
              private OrderHistoryProvider: OrderHistory) {
    this.nav = nav;
    this.activeTab = 'home';
    this.activeTabSet = 'main';

    this.direction = 'from';

    this.status = {
      from: 'определение адреса подачи такси',
      to: 'определение адреса поездки',
    };

    // setTimeout(() => {
    //   if(cordova && cordova.plugins && cordova.plugins.locationAccuracy){
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
      active: this.activeTab === active
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

    debugger
    if(!this.AuthProvider.check()){
      this.nav.push(RegistrationModal);
    }else{

      this.GatherOrderProvider.createOrder().then((data) => {

        this.nav.push(Loader);
        this.OrderHistoryProvider.save(this.GatherOrderProvider.getGatheredOrder());


      }).catch((err) => {
        console.log(err.stack)
      });

    }
    
  }
}
