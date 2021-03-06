import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Address } from './../../components/address_panel';
import {Place} from './../../providers/place/place';

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/settings/settings.html',
  directives: [Address],
  providers: [Place]
})
export class SettingsPage {

  tariffs: Array<Object>;

  constructor(private nav: NavController) {
    this.nav = nav;
    this.tariffs = [
      {name: 'Эконом', price: '50 руб'},
      {name: 'Комфорт', price: '100 руб'},
      {name: 'Бизнесс', price: '200 руб'}
    ];
  }
}
