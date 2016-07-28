import {Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import {Observable} from "rxjs/Rx";
import {Place} from "../providers/place/place";

@Component({
    selector: 'address',
    templateUrl: 'build/templates/address_panel.html',
    directives: [ROUTER_DIRECTIVES]
})
export class Address {

    address: any;
    direction: string;
    addresses: any;
    search: any;
    coords: any;
    editable: any;
    detail: boolean;

    @Input() view: any;


    constructor(private place: Place, private http: Http, private router: Router) {

        const self = this;
        this.address = {from: '', to: ''};
        this.direction = 'from';
        this.addresses = [];
        this.search = false;
        this.detail = false;
        this.editable = {
            from: true,
            to: true
        };

        place.address$.subscribe(newAdress => {
            self.address = newAdress;
        });

        place.direction$.subscribe(newDirection => {
            self.direction = newDirection;
        });

        place.coords$.subscribe(newCoords => {
            self.coords = newCoords;
        })
    }

    ngAfterViewInit() {
        if(this.view) {
            this.getAll(this.address[this.direction]);
            this.editable[this.direction] = false;
        }
    }

    clearAddress() {
        this.address[this.direction] = '';
        this.place.changeAddress(this.address)
    }

    confirmAddress(index: any) {

        let newCoords = [this.addresses[index].geoPoint.lat, this.addresses[index].geoPoint.lon];

        this.address[this.direction] = this.addresses[index].shortAddress;
        this.coords[this.direction] = newCoords;
        this.place.changeAddress(this.address);
        this.place.changeCoords(this.coords);

        this.editable[this.direction] = true;
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
            .map(this.extractData)
            .catch(this.handleError);
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

    formatAddressesSearch(address: string, addresses: any) {
        return addresses.map(item => {

            if(item.street.toLowerCase().indexOf(address.toLowerCase()) < 0) {
                item.street = [{text: item.street || item.shortAddress, class: 'white'}];
                return item
            }

            let formated = [];

            let splited = item.street.toLowerCase().split(address.toLowerCase());

            let index = splited.indexOf('');

            if(index === 0) {
                formated.push({text: address, class: 'orange'});
                formated.push({text: splited[1], class: 'white'});
            } else if(index === 1) {
                formated.push({text: splited[0], class: 'white'});
                formated.push({text: address, class: 'orange'});
            } else {
                formated.push({text: splited[0], class: 'white'});
                formated.push({text: address, class: 'orange'});
                formated.push({text: splited[1], class: 'white'});
            }

            item.street = formated;

            return item;
        });
    }

    enableEditable(direction: string) {
        this.router.navigate(['/search']);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    onFocus(type: string): void {
        if(!this.editable[type]) return;
        this.place.changeDirection(type);
    }
}



