import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash'

/*
  Generated class for the TimeTabPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'time-tab-page',
  templateUrl: 'build/pages/time-tab/time-tab.html',
})
export class TimeTabPage {

  address: boolean = true;
  header: any = 'Прошлые поездки';
  addresses: any;
  trips: any;
  alphabet: any;

  constructor() {

    this.addresses = [
      {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
      {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Работа жены", data: {street: 'Томсомольская 69, п.1'}},
      {title: "Работа жены", data: {street: 'Ромсомольская 69, п.1'}},
      {title: "Работа жены", data: {street: 'Номсомольская 69, п.1'}},
      {title: "Работа жены", data: {street: 'Акомсомольская 69, п.1'}},
      {title: "Работа жены", data: {street: 'Сомсомольская 69, п.1'}},
      {title: "Детский сад", data: {street: 'Фетрозаводская 45'}}
    ];

    this.addresses = _.groupBy(this.addresses, (a:any) => {
      return a.data.street.charAt(0).toUpperCase()
    });

    this.alphabet = Object.keys(this.addresses);

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
