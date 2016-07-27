import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

@Component({
  template: `
  <ion-content class="modal">
    <p class="header">
    <span class="cross"></span>
    Поездки будущие</p>



    <h2>I'm a modal!</h2>
  </ion-content>`
})
export class RidesModal {
  constructor() {
      console.log('RidesModal controller')
  }

}