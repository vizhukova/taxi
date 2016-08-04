import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Order } from './../../interfaces/order';


@Injectable()
export class OrderHistory {

  orders: Array<Order> = [];

  constructor(private http: Http) {
    this.getFromLS();
  }

  public save(data: Order) {

    this.orders.push(data);
    localStorage.setItem('history', JSON.stringify(this.orders));
  }

  public get() {
    return this.orders;
  }

  getFromLS() {
    let data = localStorage.getItem('history');
    data = JSON.parse(data) || [];
    this.orders = data;
  }

}

