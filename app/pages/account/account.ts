import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams} from "ionic-angular/index";
import {Platform} from "ionic-angular/index";


@Component({
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {

  constructor(private nav: NavController) {
    this.nav = nav;
  }

  showRidesModal() {

  }
}
