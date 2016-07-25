import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';
/*
  Generated class for the TimePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/time/time.html',
  directives: [Address],
  providers: [Place]
})
export class TimePage {

  time: Array<Object>;

  constructor(private nav: NavController) {
    this.nav = nav;
    this.time = [
      {name: 'Сейчас', comment: '~5-20 мин'},
      {name: 'Через', comment: '20 мин'},
      {name: 'Повторять', comment: '10:23'},
      {name: 'Другое', comment: 'чт, 7 июля 2016 10:23'}
    ];
  }
}
