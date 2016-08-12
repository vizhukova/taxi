import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Order } from './../../interfaces/order';
import {BehaviorSubject} from "rxjs/Rx";


@Injectable()
export class OrderHistory {

  orders: Array<Order> = [];

  private ordersSource = new BehaviorSubject<Array<Order>>([]);
  orders$ = this.ordersSource.asObservable();

  constructor(private http: Http) {
    this.getFromLS();
  }

  public save(data: Order) {

    localStorage.setItem('history_order', JSON.stringify(this.orders));
    this.orders.push(data);
    this.changeOrders(this.orders);
  }

  public get() {
    return this.getFromLS();
  }

  changeOrders(value) {
    this.ordersSource.next(value);
  }

  getFromLS() {
    let data = localStorage.getItem('history_order');
    data = JSON.parse(data) || [];
    this.orders = data;
    this.changeOrders(this.orders);
    return data;
  }

}

