import {Component, Input, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
//import {Observable} from "rxjs/Rx";
import {Place} from "../providers/place/place";
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


@Component({
    selector: 'address',
    templateUrl: 'build/templates/address_panel.html',
    directives: [SearchPage],
    providers: [GatherOrder]
})
export class Address {

    address: any;
    direction: string;
    addresses: any;
    search: any;
    coords: PathCoordinates;
    editable: any;
    detail: boolean;

    house: string;
    block: string;
    comment: string;

    public test: any;

    @Input() view: any;

    @ViewChild('from') vc;


    constructor(public nav: NavController,
                public GatherOrderProvider: GatherOrder,
                public AddressProvider: AddressProvider,
                private place: Place,
                private http: Http,
                private NavProvider: Nav) {

        const self = this;
        this.address = {from: '', to: ''};
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
        this.editable = {
            from: false,
            to: false
        };

        this.test = Math.random();

        this.coords = <PathCoordinates>{
            from: {latitude: 0, longitude: 0},
            to: {latitude: 0, longitude: 0}
        };

        place.address$.subscribe(newAddress => {
            self.address = newAddress;
            if(newAddress.to) {
                GatherOrderProvider.setDestination(newAddress.to);
            }
            if(newAddress.from) {
                GatherOrderProvider.setSource(newAddress.from);
            }
        });

        place.direction$.subscribe(newDirection => {
            self.direction = newDirection;
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
    }

    clearAddress(event) {

        event.stopPropagation();

        this.search = false;
        this.detail = false;

        this.address[this.direction] = '';
        this.place.changeAddress(this.address);

        this.NavProvider.changeTabSet('main');
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
        this.detail = true;
    }


    setClasses(direction: string) {
        return {
            from: direction === 'from',
            to: direction === 'to',
            active: this.direction === direction
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

    getAddresses(search: string): Observable<any> {
        let lat = this.coords[this.direction][0];
        let lon = this.coords[this.direction][1];

        const url = `http://ddtaxity.smarttaxi.ru:8000/1.x/geocode?taxiServiceId=taxity&radius=2000&lat=${lat}&lon=${lon}&search=${search}`;

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

    onFocus(type: string): void {

        if(this.direction === type && this.NavProvider.getCurrentTabSet() === 'main'){
            this.NavProvider.changeTabSet('search')
        }

        this.direction = type;

        this.place.changeDirection(type);
    }

    showFavoritePopup() {
        this.AddressProvider.changeFavoriteAddress({house: this.house, housing: this.block, description: this.comment});
        this.nav.push(FavoritePopup);
    }

    onConfirm(){
        this.search = false;
        this.detail = false;
        this.NavProvider.changeTabSet('main');
    }
}



