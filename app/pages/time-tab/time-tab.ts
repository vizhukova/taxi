import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash'
import {  OrderHistory } from './../../providers/order/history';
import {  Place } from './../../providers/place/place';
import {  Nav } from './../../providers/nav/nav';
import { MapProvider } from "./../../providers/map/map";


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

  constructor(
      public OrderHistoryProvider: OrderHistory,
      private PlaceProvider: Place,
      private NavProvider: Nav,
      private MapProvider: MapProvider
  ) {

    this.trips = this.OrderHistoryProvider.get();

    this.addresses = [];

    let uniq = [];

    this.trips.map((t) => {

      let from = t.source;
      let to = t.destinations[0];

      if(uniq.indexOf(from.shortAddress) === -1) {
        this.addresses.push(from);
        uniq.push(from.shortAddress);
      }

      if(uniq.indexOf(to.shortAddress) === -1) {
        this.addresses.push(to);
        uniq.push(to.shortAddress);
      }


    });

    this.addresses = _.groupBy(this.addresses, (a:any) => {
      return a.shortAddress.charAt(0).toUpperCase()
    });

    this.alphabet = Object.keys(this.addresses);
  }

  toggleView() {
    this.address = !this.address
  }



  setAddress(index, char){
    let address = this.addresses[char][index];

    let curCoord = this.PlaceProvider.getCurrentCoords();

    curCoord[this.PlaceProvider.getDirection()] = {
      latitude: address.lat,
      longitude: address.lon
    };

    this.PlaceProvider.changeCoords(curCoord);
    this.PlaceProvider.changeDetail(this.addresses[char][index]);
    this.NavProvider.changeTab('home');
  }

  setTrip(index) {

    var curCoord = {
      from: {
        latitude: this.trips[index].source.lat,
        longitude: this.trips[index].source.lon
      },
      to: {
        latitude: this.trips[index].destinations[0].lat,
        longitude: this.trips[index].destinations[0].lon
      }
    };


    this.PlaceProvider.changeDetail({from: this.trips[index].source, to: this.trips[index].destinations[0]}, true);
    this.MapProvider.setMarker(curCoord);
    this.MapProvider.set('direction', '');
    this.NavProvider.changeTab('home');
  }
}
