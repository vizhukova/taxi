import { Component } from '@angular/core';
import { SearchTabPage } from '../../pages/search-tab/search-tab';
import { TimeTabPage } from '../../pages/time-tab/time-tab';
import { FeedTabPage } from '../../pages/feed-tab/feed-tab';
import { FlyTabPage } from '../../pages/fly-tab/fly-tab';
import { NavController, Modal, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/search/search.html',
  directives: [SearchTabPage, TimeTabPage, FeedTabPage, FlyTabPage]
})
export class SearchPage {


  activeTab: string;

  constructor(private nav: NavController) {
    this.nav = nav;
    this.activeTab = 'search'

  }


  changeTab(newTab:string) {
    this.activeTab = newTab;
  }
}
