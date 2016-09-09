import { Component } from '@angular/core';
import { NavController, Modal, ViewController } from 'ionic-angular';
import {NavParams, Platform} from "ionic-angular/index";

import { DriverPanel } from './../../components/driver_panel/driver_panel';
import { LikesModal } from './modal/modal';

@Component({
  selector: 'like-page',
  templateUrl: 'build/pages/like/like.html',
  directives: [DriverPanel]
})
export class LikePage {

  constructor(private nav: NavController) {

  }

  openModal() {
    this.nav.push(LikesModal, {}, {animate: false});
  }



}
