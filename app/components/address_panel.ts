import {Component, Input, ViewChild, ApplicationRef } from '@angular/core';
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
    detailAddress: any;
    detailCopy: any;
    search: any;
    coords: PathCoordinates;
    disabled: any;
    detail: boolean;
    state: MapState;
    house: string;
    block: string;
    comment: string;

    public test: any;

    @Input() view: any;

    @ViewChild('from') vc;


    constructor(public nav: NavController,
                public GatherOrderProvider: GatherOrder,
                public AddressProvider: AddressProvider,
                private MapProvider: MapProvider,
                private place: Place,
                private http: Http,
                private NavProvider: Nav,
                private ref: ApplicationRef
    ) {

        const self = this;
        //this.address = {from: '', to: ''};
        this.detailAddress = {from: '', to: ''};
        this.detailCopy = {from: '', to: ''};
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
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

        //place.address$.subscribe(newAddress => {
        //    self.address = newAddress;
        //    self.MapProvider.set('searching', false);
        //    if(newAddress.to) {
        //        GatherOrderProvider.setDestination(newAddress.to);
        //    }
        //    if(newAddress.from) {
        //        GatherOrderProvider.setSource(newAddress.from);
        //    }
        //});

        place.coords$.subscribe(newCoords => {
            self.coords = newCoords;
            self.search = false;

        });

        place.detailAddress$.subscribe(newDetail => {

            //Provider data main <detailAddress>
            self.detailAddress = newDetail;
            //Model tada for view  data main <detailCopy>
            self.detailCopy = _.assign({}, newDetail);
            self.MapProvider.set('searching', false);
            setTimeout(()=>{ self.ref.tick() }, 300)
        });

        MapProvider.state$.subscribe(newState => {
            self.direction = newState.direction;

            self.state = _.assign({}, newState)
        });

        MapProvider.markers$.subscribe(newMarkers => {
            self.coords = newMarkers;
            this.detail = false;
        })


    }

    clearAddress(direction, input?:any) {

        if(direction==='to') this.search = false;
        else {
            this.addresses = this.formatAddressesSearch(this.detailCopy[direction].shortAddress, [this.detailAddress[direction]]);
            this.search = true
        }


        input.value = '';
        this.detailCopy[direction] = '';
        this.ref.tick();
    }

    confirmAddress(index: any) {
        this.disabled.to = true;
        this.disabled.from = true;

        this.detail = false;

        let address = this.addresses[index];

        let addressCoordinates = address['geoPoint'];

        let newCoords = {
            latitude: addressCoordinates.lat,
            longitude: addressCoordinates.lon
        };


        //this.address[this.direction] = address['shortAddress'];
        this.coords[this.direction] = newCoords;
        this.detailAddress[this.direction] = address;
        this.detailCopy[this.direction] = this.detailAddress[this.direction];
        //this.place.changeAddress(this.address);
        this.place.changeDetail(this.detailAddress[this.direction]);
        this.place.changeCoords(this.coords);
        this.place.reloadMap('homeMap');
        this.NavProvider.changeTabSet('main');
        this.search = false;
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

    getAddresses(search: any): Observable<any> {
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


    getAll(address: any) {
        if(address.value.length < 3) return;

        const self = this;


        this.getAddresses(address.value)
           .subscribe(
               (addresses) => {
                   self.addresses = self.formatAddressesSearch(address.value, addresses);
                   self.search = true;
                   self.ref.tick();

               },
               error => console.log(error)
           )
    }

    formatAddressesSearch(address: string, addresses: AddressItem[]) {
        return addresses.map(item => {

            if(item.shortAddress.toLowerCase().indexOf(address.toLowerCase()) < 0) {
                item.format = [{text: item['shortAddress'], className: 'white'}];
                return item
            }

            let formated = [];

            let splited = item.shortAddress.toLowerCase().split(address.toLowerCase());

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

            item.format = formated;

            return item;
        });
    }

    private static extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private static handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }



    onFocus(type: string, input ?: any): void {
        if(this.NavProvider.getCurrentTab() !== 'home') return;
        if(this.state.searching) return;
        if(this.direction === type && this.detail) return;
        if(this.state.onmapsearch && this.direction !== type) return;
        if(this.direction === 'to' && 'to' !== type && this.detail) return;
        var self = this;
        this.disabled.to = true;
        this.disabled.from = true;

        if((!this.detail && this.direction === type) || (type === 'to' && !this.coords.to.latitude)) {
            this.disabled[type] = false;
            if(this.NavProvider.getCurrentTabSet() === 'main') this.NavProvider.changeTabSet('search');
            this.MapProvider.set('editable', true);
            this.detail = true;
            setTimeout(()=>{
                if(cordova) cordova.plugins.Keyboard.show();
                input.focus();
                self.ref.tick()
            }, 150);

        }
     
        this.direction = type;

        this.MapProvider.set('direction', type);

    }

    showMap() {
        this.disabled.to = true;
        this.disabled.from = true;
        if(this.state.direction === 'to' && !this.detailAddress.to) {
            this.coords[this.direction] = this.coords.from;
            this.detailAddress[this.direction] = this.detailAddress.from;
            this.place.changeDetail(this.detailAddress, true);
            this.place.changeCoords(this.coords);
            this.detail = false;
        } else {
            this.search = false;
            this.detail = false;
        }
        this.MapProvider.set('searching', true);
        this.MapProvider.set('onmapsearch', true);
        this.NavProvider.changeTabSet('main');
    }

    showFavoritePopup() {
        let addressTosend = this.detailAddress[this.direction];

        addressTosend.house = this.detailAddress[this.direction].house;
        addressTosend.housing = this.detailAddress[this.direction].housing;
        addressTosend.description = this.detailAddress[this.direction].description;

        this.AddressProvider.changeFavoriteAddress(addressTosend);
        this.nav.push(FavoritePopup, {}, {animate: false});
    }

    onConfirm(direction:string){

        this.disabled[this.direction] = true;

        if(direction === 'to' && !this.detailCopy.to.shortAddress) {
            this.coords[this.direction] = {latitude: 0, longitude: 0};
            this.place.changeDetail("");
            this.detailCopy[this.direction] = "";
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



