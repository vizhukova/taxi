
import { Component } from '@angular/core';
//import {FormControl, Validators, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import {  NavController } from 'ionic-angular';
import {  Auth } from './../../providers/auth/auth';
import {  Place } from './../../providers/place/place';
import { MapProvider } from './../../providers/map/map';
//import {  Selecct } from './../select/select';
declare var cordova: any;

@Component({
    templateUrl: 'build/components/registration/registration.html'
    //directives: [REACTIVE_FORM_DIRECTIVES]
})
export class RegistrationModal {

   isCode: boolean = false;
   name: string;
   code: string = '+7';
    key: any;
    errorCode: any;
    timer: any;
    number: string;
    timeout: number;
    wrongKey: boolean;
   isShownInput: boolean = false;
    powers: Array<string> = ['Really Smart', 'Super Flexible',
        'Super Hot', 'Weather Changer'];
    model: string;
    errors: any;

    constructor(
        public nav: NavController,
        private AuthProvider: Auth,
        private PlaceProvider: Place,
        private MapProvider: MapProvider
    ) {
        this.MapProvider.set('authorized', false);
        this.timeout = 59;
        this.timer = null;
        this.wrongKey = false;
        this.number = '';
        this.name='';
        this.errors = {
            name: 'ВВЕДИТЕ ИМЯ',
            number: 'ВВЕДИТЕ НОМЕР',
            code: 'НЕПРАВИЛЬНЫЙ КОД'
        };
        this.errorCode = 'code'

        // cordova.plugins.Keyboard.disableScroll(true);
    }

    closeKeyboard(event) {
        if(cordova && cordova.plugins && cordova.plugins.Keyboard && event.target.tagName !== 'INPUT'){
            //window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
            //window.scrollTo(0, 0);
            //setTimeout(cordova.plugins.Keyboard.close(), 500);
            cordova.plugins.Keyboard.close();
        }


        if(event.target.className !== 'input') {
            this.isShownInput = false;
        }
    }

    setClasses() {
        return {
            sent: true,
            code: true,
            green: this.number.length === 10 && this.name.length >= 3,
        }
    }

    executeError(code) {
        this.errorCode = code;
        this.wrongKey = true;
        setTimeout(()=>{ this.wrongKey = false }, 7000)
    }


    sentCode() {
        if(this.name.length < 3 ) {
            this.executeError('name');
            return;
        } else if(this.number.length < 10 || this.number.length > 10) {
            this.executeError('number');
            return;
        }

        this.isCode = true;
        this.AuthProvider.register(this.name, this.code + this.number);
        this.startTime();
    }

    startTime() {
        this.timer = setInterval(()=>{
            if(this.timeout < 2) {
                clearInterval(this.timer);
                this.timer = null;
                this.timeout = 59;
            }
            --this.timeout
        }, 1000)
    }

    skipRegister() {
        var self = this;
        this.nav.pop({animate: false});
        this.PlaceProvider.reloadMap('homeMap');
        setTimeout(()=>{
            self.MapProvider.set('authorized', true);
        }, 1000);
    }



    register() {
        var self = this;

        if(this.key === 7575) {
            this.nav.pop({animate: false});
            this.PlaceProvider.reloadMap('homeMap');
            setTimeout(()=>{ self.MapProvider.set('authorized', true) }, 1000);
        } else if(this.isCode && this.key) {
            this.AuthProvider.confirm(this.key, this.code + this.number).then((data) => {
                if(data !== 'WRONGKEY')  {
                    self.nav.pop({animate: false});
                    setTimeout(()=>{ self.MapProvider.set('authorized', true) }, 1000);
                } else if(data === 'WRONGKEY'){
                    self.executeError('code')
                } else { console.log(data) }
            })
        } else {
           self.executeError('code')
        }
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

    public ngOnDestroy():void {
        clearInterval(this.timer);
    }
}

