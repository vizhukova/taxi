import { Component } from '@angular/core';
import { Modal, NavController, ViewController } from 'ionic-angular';

@Component({
  template: `
  <ion-content padding>
    <h2>I'm a modal!</h2>
  </ion-content>`
})
export class RidesModal {
  constructor(private viewCtrl: ViewController) {
      console.log('RidesModal controller')
  }

}