import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Auth } from './../../providers/auth/auth';
import {  Place } from './../../providers/place/place';

@Component({
    templateUrl: 'build/components/registration/registration.html',
    providers: [Auth]
})
export class RegistrationModal {

   isCode: boolean = false;
   name: string;
   code: string;
   number: string;
   key: string;

    constructor(public nav: NavController, private AuthProvider: Auth, private PlaceProvider: Place) {

    }

     onPageWillEnter() {
        //hide nav bar when we enter the page
        (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "none";
    }
    //show nav bar when we leave the page
    onPageDidLeave() {
       (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "flex";
    }

    sentCode() {
        this.isCode = true;
        console.log(this);
        this.AuthProvider.register(this.name, this.code + this.number);
    }

    register() {
        if(this.isCode) {
           this.AuthProvider.confirm(this.key, this.code + this.number).then(() => {
               this.nav.pop();
           });

        } else {
            this.PlaceProvider.reloadMap('homeMap');
        }
    }

}