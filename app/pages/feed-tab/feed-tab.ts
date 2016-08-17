import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

import {  Order } from './../../interfaces/order';

import {  OrderFavorite } from './../../providers/order/favorites';
import {  AddressProvider } from './../../providers/address/address';
import {  OrderHistory } from './../../providers/order/history';
import {  Place } from './../../providers/place/place';
import {  GatherOrder } from './../../providers/order/gather_order';
import { CarOptions } from './../../providers/car-options/car-options';
import { TimeProvider } from './../../providers/time/time';

import {  Nav } from './../../providers/nav/nav';


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
  optionDetails: string; //id of item + key (o-(order) a-(address))

  constructor(private nav: NavController,
              public OrderFavoriteProvider: OrderFavorite,
              public AddressProvider: AddressProvider,
              public OrderHistoryProvider: OrderHistory,
              public PlaceProvider: Place,
              public GatherOrderProvider: GatherOrder,
              public CarOptionsProvider: CarOptions,
              public TimeProvider: TimeProvider,
              public NavProvider: Nav) {

    this.nav = nav;

    //this.addresses = [
    //  {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
    //  {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
    //  {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
    //  {title: "Детский сад", data: {street: 'Петрозаводская 45'}}
    //];



    this.addresses = this.AddressProvider.getFavoriteAddresses();
    this.trips = this.OrderFavoriteProvider.get();

     OrderFavoriteProvider.orders$.subscribe(orders => {
      this.trips = orders;
    });

    this.AddressProvider.addressArrayFavorite$.subscribe(addresses => { //TODO не отрабатывает при вызове next
      this.addresses = addresses;
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

  public setLastOrderOptions(order: Order) {

      this.PlaceProvider.changeAddress({
          to: order.destinations[0].shortAddress,
          from: order.source.shortAddress
      });

      this.CarOptionsProvider.changerCarClass(order.vehicleClass);
      this.CarOptionsProvider.changerRequirements(order.requirements);
      this.TimeProvider.change(order.bookingObj);

      this.NavProvider.changeTab('home');
  }

  public setLastAddress(key: string) {
    let address = this.PlaceProvider.getAddress();
    let direction = this.PlaceProvider.getDirection();
    let coords = this.PlaceProvider.getCurrentCoords();

    address[direction] = this.addresses[key].shortAddress;
    coords[direction] = {
      latitude: this.addresses[key].geoPoint.lat,
      longitude: this.addresses[key].geoPoint.lon
    };

    this.PlaceProvider.changeAddress(address);
    this.PlaceProvider.changeCoords(coords);

    this.NavProvider.changeTab('home');
  }
}
