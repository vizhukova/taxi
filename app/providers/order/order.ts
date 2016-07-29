import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { OrderModel } from './../../models/order';


@Injectable()
export class Order {
  data: any;

  constructor(private http: Http, private order: OrderModel) {



  }

  create(){

  }

  setDestination(){

  }

  setSource


}

