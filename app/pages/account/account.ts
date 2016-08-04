import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams} from "ionic-angular/index";
import {Platform} from "ionic-angular/index";
import {RidesModal} from "./modal/rides";
import {Auth} from "../../providers/auth/auth";


@Component({
  selector: 'account-page',
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
  
  user:any;

  constructor(private nav: NavController, private AuthProvider: Auth) {
    this.nav = nav;

    this.user = {
      name: null,
      id: null,
      phone: null
    };

    AuthProvider.user$.subscribe(user => {
      this.user = user;
    })
  }

  showRidesModal() {
    this.nav.push(RidesModal);
  }
}
