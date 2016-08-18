import {Component, Input, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
//import {Observable} from "rxjs/Rx";
import {Place} from "../providers/place/place";
import { MapProvider } from "../providers/map/map";
import {GatherOrder} from './../providers/order/gather_order';
import { NavController } from 'ionic-angular';
import {SearchPage} from "../pages/search/search";
import {FavoritePopup} from "../pages/search-tab/favorite_popup/popup";
import {Nav} from "../providers/nav/nav";
import {PathCoordinates} from "../interfaces/coordinates";
//import {AddressItem} from "../interfaces/address";
import {AddressProvider} from "../providers/address/address";
import {Subject, BehaviorSubject, Observable} from 'rxjs'
import {AddressItem} from "../interfaces/address";
import {MapState} from "../interfaces/map";
import * as _ from 'lodash';
declare var cordova: any;

@Component({
    selector: 'address',
    templateUrl: 'build/templates/address_panel.html',
    directives: [SearchPage]
})
export class Address {

    address: any;
    direction: string;
    addresses: any;
    confirmedAddresses: any;
    search: any;
    coords: PathCoordinates;
    disabled: any;
    detail: boolean;
    state: MapState;
    house: string;
    block: string;
    comment: string;
    clicked: boolean;

    public test: any;

    @Input() view: any;

    @ViewChild('from') vc;


    constructor(public nav: NavController,
                public GatherOrderProvider: GatherOrder,
                public AddressProvider: AddressProvider,
                private MapProvider: MapProvider,
                private place: Place,
                private http: Http,
                private NavProvider: Nav) {

        const self = this;
        this.address = {from: '', to: ''};
        this.confirmedAddresses = {from: '', to: ''};
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
        this.clicked = false;
        this.state = {};
        this.disabled = {
            from: true,
            to: true
        };

        this.test = Math.random();

        this.coords = <PathCoordinates>{
            from: {latitude: 0, longitude: 0},
            to: {latitude: 0, longitude: 0}
        };

        place.address$.subscribe(newAddress => {
            self.address = newAddress;
            self.MapProvider.set('searching', false)
            if(newAddress.to) {
                GatherOrderProvider.setDestination(newAddress.to);
            }
            if(newAddress.from) {
                GatherOrderProvider.setSource(newAddress.from);
            }
        });

        MapProvider.state$.subscribe(newState => {
            self.direction = newState.direction;

            //TODO map onClick
            // if(newState.clicked !== self.clicked && newState.editable  && newState.searching) {
            //     self.onConfirm()
            // }

            self.clicked = newState.clicked;
            self.state = _.assign({}, newState)
        });

        place.coords$.subscribe(newCoords => {
            self.coords = newCoords;
        })
    }

    ngAfterViewInit() {

        // if(this.view) {
        //     this.getAll(this.address[this.direction]);
        //     this.editable[this.direction] = false;
        // }

        // this.vc.nativeElement.focus();
        //TODO back button
        // document.addEventListener('backbutton', ()=>{
        //     this.onConfirm();
        // }, false)
    }

    clearAddress(direction) {

        this.address[direction] = '';

        if(direction==='to') this.search = false;
        else this.search = true

    }

    confirmAddress(index: any) {

        let address = this.addresses[index];
        let addressCoordinates = address['geoPoint'];

        let newCoords = {
            latitude: addressCoordinates.lat,
            longitude: addressCoordinates.lon
        };

        this.address[this.direction] = address['shortAddress'];
        this.coords[this.direction] = newCoords;
         this.place.changeAddress(this.address);
         this.place.changeCoords(this.coords);
        this.place.reloadMap('homeMap');

        // this.editable[this.direction] = true;
        this.search = false;
        // this.detail = true;
    }


    setClasses(direction: string) {
        return {
            from: direction === 'from',
            to: direction === 'to',
            active: this.direction === direction
        }
    }

    setClassesIcon(direction:string) {
        return {
            icon: true,
            active: !this.disabled[direction] && this.direction === direction
        }
    }
    
    setViewClasses() {
        return {
            from: this.direction === 'from',
            searchView: true,
            to: this.direction === 'to'
        }
    }
    
    setDetailClasses() {
        return {
            addressDetail: true,            
            from: this.direction === 'from',
            to: this.direction === 'to'
        }
    }

    setInputClasses() {
        return {
            opacity: this.state.searching
        }
    }

    getAddresses(search: string): Observable<any> {
        let lat = this.coords[this.direction].latitude;
        let lon = this.coords[this.direction].longitude;
        
        if(!lat && !lon) {
            lat = this.coords.from.latitude;
            lon = this.coords.from.longitude;
        }

        const url = `http://ddtaxity.smarttaxi.ru:8000/1.x/geocode?taxiServiceId=taxity_mobile&radius=200000&lat=${lat}&lon=${lon}&search=${search}`;
        this.search = true;
        return this.http.get(url)
            .map(Address.extractData)
            .catch(Address.handleError);
    }


    getAll(address: string) {
        if(address.length < 3) return;

        const self = this;


        this.getAddresses(address)
           .subscribe(
               (addresses) => {
                   self.addresses = self.formatAddressesSearch(address, addresses);
                   self.search = true;
               },
               error => console.log(error)
           )
    }

    formatAddressesSearch(address: string, addresses: AddressItem[]) {
        return addresses.map(item => {

            if(item.street.toLowerCase().indexOf(address.toLowerCase()) < 0) {
                item.street = [{text: item.street || item['shortAddress'], className: 'white'}];
                return item
            }

            let formated = [];

            let splited = item.street.toLowerCase().split(address.toLowerCase());

            let index = splited.indexOf('');

            if(index === 0) {
                formated.push({text: address, className: 'orange'});
                formated.push({text: splited[1], className: 'white'});
            } else if(index === 1) {
                formated.push({text: splited[0], className: 'white'});
                formated.push({text: address, className: 'orange'});
            } else {
                formated.push({text: splited[0], className: 'white'});
                formated.push({text: address, className: 'orange'});
                formated.push({text: splited[1], className: 'white'});
            }

            item.street = formated;

            return item;
        });
    }

    private static extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private static handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    onFocus(type: string, input ?: any): void {
        this.disabled.to = true;
        this.disabled.from = true;


        if(this.state.searching) return;

        if(this.direction === type && this.detail) {
            this.disabled[type] = false;
            setTimeout(()=>{
                if(cordova) cordova.plugins.Keyboard.show();
                input.focus();
            }, 150)
        } else if(type === 'to' && !this.address.to) {
            this.NavProvider.changeTabSet('search');
            this.MapProvider.set('editable', true);
            this.detail = true;
            this.disabled[type] = false;
            setTimeout(()=>{
                if(cordova) cordova.plugins.Keyboard.show();
                input.focus();
            }, 150)
        }

        if(this.direction === type && this.NavProvider.getCurrentTabSet() === 'main'){
            this.NavProvider.changeTabSet('search');
            this.MapProvider.set('editable', true);
            this.detail = true;
        }

        this.direction = type;

        this.MapProvider.set('direction', type);

    }

    showMap() {
        if(this.state.direction === 'to' && !this.address.to) {
            this.coords[this.direction] = this.coords.from;
            this.address[this.direction] = this.address.from;
            this.place.changeAddress(this.address);
            this.place.changeCoords(this.coords);
            this.detail = false;
        } else {
            this.search = false;
            this.detail = false;
        }
        this.NavProvider.changeTabSet('main');
    }

    showFavoritePopup() {
        let addressTosend = this.addresses[0];

        addressTosend.house = this.house;
        addressTosend.housing = this.block;
        addressTosend.description = this.comment;

        this.AddressProvider.changeFavoriteAddress(addressTosend);
        this.nav.push(FavoritePopup);
    }

    onConfirm(direction:string){

        this.disabled[this.direction] = true;

        if(direction === 'to' && !this.address.to) {
            this.coords[this.direction] = {latitude: 0, longitude: 0};
            this.place.changeAddress(this.address);
            this.MapProvider.set('direction', 'from');
            this.place.changeCoords(this.coords);
            this.detail = false;
        } else {
            this.search = false;
            this.detail = false;
        }

        this.NavProvider.changeTabSet('main');
        this.MapProvider.set('searching', false);
    }

}



