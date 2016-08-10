import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Address } from './../../components/address_panel';

import {Place} from './../../providers/place/place';
import {CarOptions} from './../../providers/car-options/car-options';
/*
  Generated class for the TimePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'time-page',
  templateUrl: 'build/pages/time/time.html'
})
export class TimePage {

  //time: Array<Object>;
  time: Array<string>;
  repeatTime: string;
  delayTime: string;
  timeInput: string;

  constructor(private nav: NavController, private CarOptionsProvider: CarOptions) {
    this.nav = nav;
    //this.time = [
    //  {name: 'Сейчас', comment: '~5-20 мин'},
    //  {name: 'Через', comment: '20 мин'},
    //  {name: 'Повторять', comment: '10:23'},
    //  {name: 'Другое', comment: 'чт, 7 июля 2016 10:23'}
    //];

    this.time = ['now', 'in', 'repeat', 'delay'];
  }

  public getId(name: string, id: number):string{
    return name + id;
  }

  public checkTime(value) {
    this.timeInput = value;
    this.CarOptionsProvider.changerTime(value);
  }
}
