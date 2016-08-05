
import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Auth } from './../../providers/auth/auth';
import {  Place } from './../../providers/place/place';
//import {  Selecct } from './../select/select';
import { NgForm }    from '@angular/forms';
import { HeroFormComponent } from './../../example/hero-form.component';

@Component({
    templateUrl: 'build/components/registration/registration.html',
    providers: [Auth],
    directives: [HeroFormComponent]
})
export class RegistrationModal {

   isCode: boolean = false;
   name: string;
   code: string;
   number: string;
   key: string;
    powers: Array<string> = ['Really Smart', 'Super Flexible',
        'Super Hot', 'Weather Changer'];
    model: string;

    constructor(public nav: NavController, private AuthProvider: Auth, private PlaceProvider: Place) {
        debugger
    }

     onPageWillEnter() {
        //hide nav bar when we enter the page
        // (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "none";
    }
    //show nav bar when we leave the page
    onPageDidLeave() {
       // (<HTMLScriptElement[]><any>document.getElementsByTagName('ion-tabbar'))[0].style.display = "flex";
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
            this.nav.pop();
            this.PlaceProvider.reloadMap('homeMap');
        }

        this.PlaceProvider.changePathStatus(false);
    }

}