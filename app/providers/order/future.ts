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

    this.orders.push(data);
    localStorage.setItem('future_order', JSON.stringify(this.orders));
  }

  public get() {
    return this.orders;
  }

  getFromLS() {
    let data = localStorage.getItem('future_order');
    data = JSON.parse(data) || [];
    this.orders = data;
  }

}

