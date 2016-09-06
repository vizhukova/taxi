import { Component } from '@angular/core';
import { OrderFavorite } from './../../providers/order/favorites';
import { AddressProvider } from './../../providers/address/address';
import { Place } from './../../providers/place/place';
import { Nav } from './../../providers/nav/nav';
import { MapProvider } from "./../../providers/map/map";

@Component({
  selector: 'feed-tab-page',
  templateUrl: 'build/pages/feed-tab/feed-tab.html'
})
export class FeedTabPage {

  address: boolean = true;
  header: any = {
    address: 'Избранные адреса',
    trip: 'Избранные поездки'
  };
  addresses: any;
  trips: any;
  optionDetails: string; //id of item + key (o-(order) a-(address))

  constructor(
      public OrderFavoriteProvider: OrderFavorite,
      public AddressProvider: AddressProvider,
      public PlaceProvider: Place,
      public NavProvider: Nav,
      public MapProvider: MapProvider
  ) {

    this.addresses = [
      {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
      {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Детский сад", data: {street: 'Петрозаводская 45'}}
    ];



    this.AddressProvider.getFavoriteAddresses();
    //this.trips = this.OrderFavoriteProvider.get();

    AddressProvider.addressesFavorite$.subscribe(addresses => {
      this.addresses = addresses;
    });

     OrderFavoriteProvider.orders$.subscribe(orders => {
      this.trips = orders;
    });

  }

  getAddressKeys() {
    return Object.keys(this.addresses);
  }

  toggleView() {
    this.address = !this.address
  }

  public showOptions(key: string, event: any) {
    this.optionDetails = this.optionDetails === key ? '-1' : key;
    event.stopPropagation();
  }

  editTrip(num: string) {

  }

  deleteTrip(num: string) {
    this.trips = this.trips.filter((item, index) => index != num);
    this.OrderFavoriteProvider.saveNewArray(this.trips);
    this.optionDetails = '-1';
  }

  editAddress(key: string) {

  }

  deleteAddress(key: string) {
    delete this.addresses[key];
    this.AddressProvider.saveObject(this.addresses);
    this.optionDetails = '-1';
  }

  hideOptionDetails() {
    this.optionDetails = '-1';
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

  setTrip(index, event) {

    event.stopPropagation();

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
    var curent = this.PlaceProvider.getDirection();
    this.MapProvider.set('direction', curent === 'from' ? 'to' : 'from');
    this.MapProvider.set('direction', curent === 'to' ? 'to' : 'from');
    this.NavProvider.changeTab('home');
  }
}
