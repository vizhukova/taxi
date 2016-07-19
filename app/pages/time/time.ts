import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TimePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/time/time.html',
})
export class TimePage {


  constructor(private nav: NavController) {
    this.nav = nav;
  }
}
