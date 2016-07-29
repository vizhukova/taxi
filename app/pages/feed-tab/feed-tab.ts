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
  addresses: any;
  trips: any;

  constructor() {

    this.addresses = [
      {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
      {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Детский сад", data: {street: 'Петрозаводская 45'}}
    ];
    
    this.trips = [
      {title: "Дом", data: {from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64'}},
      {title: "Моя работа", data: {from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64'}},
      {title: "Работа жены", data: {from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64'}},
      {title: "Детский сад", data: {from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64'}}
    ]
    
  }

  toggleView() {
    this.address = !this.address
  }
}
