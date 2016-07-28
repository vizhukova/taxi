import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Auth } from './../../providers/auth';

@Component({
    templateUrl: 'build/components/registration/registration.html',
    providers: [Auth]
})
export class RegistrationModal {

   isCode: boolean = false;
   name: string;
   code: string;
   number: string;
   nav: any;

    constructor(private AuthProvider: Auth, nav: NavController) {
        this.nav = nav;
    }

    sentCode() {
        this.isCode = true;
        console.log(this)
        this.AuthProvider.register(this.name, this.code + this.number);
    }

    register() {
        if(this.isCode) {

        } else {
            this.nav.pop();
        }
    }

}