import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';
import {Loader} from './../../components/loader/loader';
import {GatherOrder} from './../../providers/order/gather_order';

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'settings-page',
  templateUrl: 'build/pages/settings/settings.html',
  directives: [Address],
  providers: [GatherOrder]
})
export class SettingsPage {

  tariffs: Array<Object>;
  payment: Array<string>;
  service: Array<Object>;

  tariffInput: any;
  paymentInput: string;
  serviceInput: Array<string> = [];

  constructor(public GatherOrderProvider: GatherOrder, private nav: NavController) {
    this.nav = nav;
    this.tariffs = [
      {name: 'Эконом', price: '50 руб'},
      {name: 'Комфорт', price: '100 руб'},
      {name: 'Бизнесс', price: '200 руб'}
    ];
    this.payment = ['Наличными', 'Безналичными', 'Баллами'];
    this.service = [
      {name: 'Перевозки животных', comment: ''},
      {name: 'Детское кресло', comment: '3 года'},
      {name: 'Водитель не курит', comment: ''},
      {name: 'Кондиционер', comment: ''},
      {name: 'Универсал', comment: ''},
      {name: 'Купон', comment: ''},
      {name: 'WI-FI', comment: ''}
    ];

    this.changeTariff(this.tariffs[0]);
    this.changePayment(this.payment[0]);
  };



  getId(name: string, id: number):string{
    return name + id;
  }

  showLoader() {
    this.nav.push(Loader);
  }

  changeTariff(data:Object) {
    this.tariffInput = data;
  }

  changePayment(data: string) {
    this.paymentInput = this.paymentInput === data ? '' : data;
  }

  changeService(data: string) {
    let filtered = this.serviceInput.filter((item:string) => data === item);

    if(filtered.length) {
      this.serviceInput = this.serviceInput.filter((item:string) => data !== item);
    }else {
      this.serviceInput.push(data);
    }
    this.GatherOrderProvider.setRequirements(this.serviceInput);
    console.log(this.GatherOrderProvider.get());
  }

  isCheckedService(data: string) {
    return this.serviceInput.filter((item:string) => data === item).length > 0;
  }

  func() {
    console.log(this.tariffInput)
    console.log(this.paymentInput)
    console.log(this.serviceInput)
  }
}
