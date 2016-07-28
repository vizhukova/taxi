import { Component } from '@angular/core';

@Component({
  templateUrl: 'build/pages/feed-tab/feed-tab.html',
})
export class FeedTabPage {

  address: boolean = true;
  header: any = {
    address: 'Избранные адреса',
    trip: 'Избранные поездки'
  };

  constructor() {


  }


  toggleView() {
    this.address = !this.address
  }
}
