import { Component } from '@angular/core';
import { SearchTabPage } from '../../pages/search-tab/search-tab';
import { TimeTabPage } from '../../pages/time-tab/time-tab';
import { FeedTabPage } from '../../pages/feed-tab/feed-tab';
import { FlyTabPage } from '../../pages/fly-tab/fly-tab';

@Component({
  templateUrl: 'build/pages/search/search.html',
})
export class SearchPage {

  search: any = SearchTabPage;
  time: any = TimeTabPage;
  feed: any = FeedTabPage;
  fly: any = FlyTabPage;

  constructor() {
    
  }
}
