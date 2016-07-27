import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import { Router } from '@angular/router';
import {NavParams} from "ionic-angular/index";
import {Platform} from "ionic-angular/index";


@Component({
  templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {

  constructor(private nav: NavController, private router: Router) {
    this.nav = nav;
  }

  showRidesModal() {
    this.router.navigate(['/rides']);
  }
}
