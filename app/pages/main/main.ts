import { Component } from '@angular/core';

import { AccountPage } from '../../pages/account/account';
import { HomePage } from '../../pages/home/home';
import { SettingsPage } from '../../pages/settings/settings';
import { TimePage } from '../../pages/time/time';

import { SearchTabPage } from '../../pages/search-tab/search-tab';
import { TimeTabPage } from '../../pages/time-tab/time-tab';
import { FeedTabPage } from '../../pages/feed-tab/feed-tab';
import { FlyTabPage } from '../../pages/fly-tab/fly-tab';

import {NavController, Modal, ViewController} from 'ionic-angular';
import {Nav} from "../../providers/nav/nav";
import {RegistrationModal} from "../../components/registration/registration";
import {Auth} from "../../providers/auth/auth";

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

  constructor(private nav: NavController, private NavProvider: Nav, private AuthProvider: Auth) {
    this.nav = nav;
    this.activeTab = 'home';
    this.activeTabSet = 'main';

    NavProvider.tab$.subscribe(tab => {
      this.activeTab = tab;
    });

    NavProvider.tabSet$.subscribe(tabSet => {
      this.activeTabSet = tabSet;
    })

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
    }
  }
}
