import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Order } from './../../interfaces/order';


@Injectable()
export class OrderFavorite {

  orders: Array<Order> = [];

  constructor(private http: Http) {
    this.getFromLS();
  }

  public save(data: Order) {

    var result = this.orders.filter((order) =>
      order.destinations[0].lat === data.destinations[0].lat
      && order.destinations[0].lon === data.destinations[0].lon
      && order.source.lon === data.source.lon
      && order.source.lat === data.source.lat
    );

    if(result.length) return; //for unique orders

    this.orders.push(data);
    localStorage.setItem('favorite_order', JSON.stringify(this.orders));
  }

  public get() {
    return this.orders;
  }

  getFromLS() {
    let data = localStorage.getItem('favorite_order');
    data = JSON.parse(data) || [];
    this.orders = data;
  }

}

