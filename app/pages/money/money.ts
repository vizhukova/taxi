import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams, Platform} from "ionic-angular/index";

import {LikesModal} from "../like/modal/modal";

import {Cost} from "../../providers/cost/cost";



@Component({
  selector: 'money-page',
  templateUrl: 'build/pages/money/money.html',
})
export class MoneyPage {

  payments: Array<Object>;
  bank: Object;
  cards: Array<Object>;
  paymentInput: Object;
  isOpenSelect: boolean;
  cost: number;

  constructor(private nav: NavController, public CostProvider: Cost) {
    this.payments = [
      {name: 'Наличными', comment: '', price: ''},
      {name: 'Баллами', comment: '', price: '493'},
      {name: 'Корпоративный счет', comment: 'Соса-Cola', price: '10 000 руб'}
    ];

    this.cards = [
      {name: 'QIWI', comment: 'XXXX XXXX XXXX 6279'},
      {name: 'Кредитка сбербанка', comment: 'XXXX XXXX XXXX 6279'},
      {name: 'Яндекс карта', comment: 'XXXX XXXX XXXX 6279'}
    ];

    CostProvider.cost$.subscribe(cost => {
      this.cost = cost;
    });

    this.bank = this.cards[1];
    this.paymentInput = this.payments[0];
  }

  changePayment(item) {
    this.paymentInput = item;
  }

  setIsOpenSelect(event, value: boolean) {
    this.isOpenSelect = value === this.isOpenSelect ? !value : value;
    event.stopPropagation();
  }

  closeSelect() {
    this.isOpenSelect = false;
  }

  setCard(item) {
    this.bank = item;
    this.changePayment(item);
  }

  openModal() {
    this.nav.push(LikesModal);
  }

}
