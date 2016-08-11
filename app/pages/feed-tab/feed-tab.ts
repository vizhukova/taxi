import { Component } from '@angular/core';
import {  OrderFavorite } from './../../providers/order/favorites';
import {  AddressProvider } from './../../providers/address/address';


@Component({
  selector: 'feed-tab-page',
  templateUrl: 'build/pages/feed-tab/feed-tab.html',
  providers: [AddressProvider]
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

  constructor(public OrderFavoriteProvider: OrderFavorite, public AddressProvider: AddressProvider) {

    this.addresses = [
      {title: "Дом", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Моя работа", data: {street: 'Петрозаводская 45'}},
      {title: "Работа жены", data: {street: 'Комсомольская 69, п.1'}},
      {title: "Детский сад", data: {street: 'Петрозаводская 45'}}
    ];



    this.addresses = this.AddressProvider.getFavoriteAddresses();
    this.trips = this.OrderFavoriteProvider.get();

  }

  getAddressKeys() {
    return Object.keys(this.addresses);
  }

  toggleView() {
    this.address = !this.address
  }

  public showOptions(key: string, event: any) {
    this.optionDetails = key;
    event.stopPropagation();
  }
}
