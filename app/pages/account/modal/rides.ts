import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular/index';

@Component ({
    template: `
        <ion-card class='popover'>
            <ion-card-content>
                Hello
            </ion-card-content>
        </ion-card>
    `
})
export class AccModal {

  private dumbData: number;

  constructor(private params: NavParams) {
   console.log("constructor");
   this.dumbData= 22;
   console.log('Param:', params.get('param'));
 }

}

