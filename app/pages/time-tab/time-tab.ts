import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import _ from 'lodash'

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

    // this.addresses = _.groupBy(this.addresses, (a)=>{
    //   a.data.street.charAt(0)
    // });

    this.trips = [
      {title: "Дом", data: {from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64'}},
      {title: "Моя работа", data: {from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64'}},
      {title: "Работа жены", data: {from: 'Комсомольская 69, п.1', to: 'Большая Серпуховская, 64'}},
      {title: "Детский сад", data: {from: 'Петрозаводская 45', to: 'Большая Серпуховская, 64'}}
    ]
  }
  
  sortList(addresses: any) {
    var sorted = addresses.sort((a, b) => {

      if (a.data.street > b.data.street) return 1;
      
      if (a.data.street < b.data.street) return -1;
      
      return 0;
      
    });
    
    sorted.map(item => {
      
    })
  }


  toggleView() {
    this.address = !this.address
  }
}
