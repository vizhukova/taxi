import { Component } from '@angular/core';
import {  OrderHistory } from './../../providers/order/history';


@Component({
  selector: 'feed-tab-page',
  templateUrl: 'build/pages/feed-tab/feed-tab.html',
})
export class FeedTabPage {

  address: boolean = true;
  header: any = {
    address: 'Избранные адреса',
    trip: 'Избранные поездки'
  };
  addresses: any;
  trips: any;

  constructor(public OrderHistoryProvider: OrderHistory) {

    this.addresses = [
      {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
      {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Детский сад", data: {street: 'Петрозаводская 45'}}
    ];
    
    this.trips = this.OrderHistoryProvider.get();



    
  }

  toggleView() {
    this.address = !this.address
  }
}
