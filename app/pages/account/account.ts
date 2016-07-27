import { Modal, NavController } from 'ionic-angular/index';
import { AccModal } from './modal/rides.ts'
import { Component } from "@angular/core";


@Component({
  templateUrl:"./build/pages/account/template.html"
})
export class AccountPage {

  constructor(private nav: NavController) {

	}

  presentModal() {
      let myModal = Modal.create(AccModal, {param: "something"});
      console.log('myModal is ', myModal);
      this.nav.present(myModal);
      console.log("function being called");
  }


}

//import { Component } from '@angular/core';
//import { NavController, Modal, ViewController } from 'ionic-angular';
//import {NavParams} from "ionic-angular/index";
//import {Platform} from "ionic-angular/index";
////import { RidesModal } from './modal/rides';
//
//
//@Component({
//  templateUrl: 'build/pages/account/account.html',
//})
//export class AccountPage {
//
//  constructor(private nav: NavController) {
//    this.nav = nav;
//  }
//
//  showRidesModal() {
//    console.log('clickkkkkk')
//    let modal = Modal.create(RidesModal);
//    this.nav.present(modal);
//  }
//}
//
//@Component({
//  template: `<div class='modalMe'></div>`
//
//})
// class RidesModal {
//  constructor(
//      public platform: Platform,
//      public params: NavParams,
//      public viewCtrl: ViewController
//  ) {}
//
//  close() {
//    this.viewCtrl.dismiss();
//  }
//}
