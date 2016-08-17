
import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  Auth } from './../../providers/auth/auth';
import {  Place } from './../../providers/place/place';
import { MapProvider } from './../../providers/map/map';
//import {  Selecct } from './../select/select';
declare var cordova: any;

@Component({
    templateUrl: 'build/components/registration/registration.html',
    providers: [Auth],
})
export class RegistrationModal {

   isCode: boolean = false;
   name: string;
   code: string = '+7';
   number: string;
   key: string;
   isShownInput: boolean = false;
    powers: Array<string> = ['Really Smart', 'Super Flexible',
        'Super Hot', 'Weather Changer'];
    model: string;

    constructor(
        public nav: NavController,
        private AuthProvider: Auth,
        private PlaceProvider: Place,
        private MapProvider: MapProvider
    ) {
        //cordova.plugins.Keyboard.disableScroll(true);
        this.MapProvider.set('authorized', false);
    }

    closeKeyboard(event) {
        if(cordova && cordova.plugins && cordova.plugins.Keyboard && event.target.tagName !== 'INPUT'){
            //window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
            //window.scrollTo(0, 0);
            //setTimeout(cordova.plugins.Keyboard.close(), 500);
            cordova.plugins.Keyboard.close();
        }

        cordova.plugins.Keyboard.shrinkView(false);

        if(event.target.className !== 'input') {
            this.isShownInput = false;
        }
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
        var self = this;

        if(this.isCode) {
           this.AuthProvider.confirm(this.key, this.code + this.number).then(() => {
               this.nav.pop();
           });

        } else {
            this.nav.pop();
            this.PlaceProvider.reloadMap('homeMap');
        }

        setTimeout(()=>{
            self.MapProvider.set('authorized', true);
        }, 1000);

    }

    showSelect(value) {
        this.isShownInput = value;
    }

    setCode(value) {
        this.code = value;
    }

    clearNumber() {
        this.number = '';
    }

}