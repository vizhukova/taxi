import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash'
import {  OrderHistory } from './../../providers/order/history';
import {  Place } from './../../providers/place/place';
import {  Nav } from './../../providers/nav/nav';


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

  constructor(public OrderHistoryProvider: OrderHistory, private PlaceProvider: Place, private NavProvider: Nav) {

    this.trips = this.OrderHistoryProvider.get();

    this.addresses = [];

    let uniq = [];

    this.trips.map((t) => {

      let from = t.source;
      let to = t.destinations[0];

      if(uniq.indexOf(from.shortAddress) === -1) {
        this.addresses.push({data: {street: from.shortAddress, geo: {lat: from.lat, lon: from.lon}}});
        uniq.push(from.shortAddress);
      }

      if(uniq.indexOf(to.shortAddress) === -1) {
        this.addresses.push({data: {street: to.shortAddress, geo: {lat: to.lat, lon: to.lon}}});
        uniq.push(to.shortAddress);
      }


    });

    this.addresses = _.groupBy(this.addresses, (a:any) => {
      return a.data.street.charAt(0).toUpperCase()
    });

    this.alphabet = Object.keys(this.addresses);
  }

  toggleView() {
    this.address = !this.address
  }



  setAddress(index, char){
    let address = this.addresses[index].geoPoint;

    let curCoord = this.PlaceProvider.getCurrentCoords();

    curCoord[this.PlaceProvider.getDirection()] = {
      latitude: address.lat,
      longitude: address.lon
    };

    this.PlaceProvider.changeCoords(curCoord);
    this.PlaceProvider.changeDetail(this.addresses[index]);
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

    this.PlaceProvider.changeCoords(curCoord);
    this.PlaceProvider.changeDetail({from: this.trips[index].source, to: this.trips[index].destinations[0]}, true);
    this.NavProvider.changeTab('home');
  }
}
