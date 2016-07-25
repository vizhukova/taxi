import {Component, NgZone, Output, EventEmitter, ApplicationRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Place} from './../providers/place/place';
import {Observable} from "rxjs/Rx";

@Component({
    selector: 'address',
    templateUrl: 'build/templates/address_panel.html'
})
export class Address {

    @Output() directionUpdated = new EventEmitter();

    address: any;
    direction: string;
    addresses: any;
    search: any;

    constructor(private Place: Place, private NgZone: NgZone, private http: Http, private ApplicationRef: ApplicationRef) {

        const self = this;
        this.address = {from: '', to: ''};
        this.direction = 'from';
        this.addresses = {
            current: []
        };
        this.search = {
            current: false
        };

        setInterval(()=>{
            self.search.current = true;
        }, 3000);

        setInterval(()=>{
            self.search.current = false;
        }, 6000);

        Place.address$.subscribe(address => {
            self.address = address;
        });

        Place.direction$.subscribe(newDirection => {
            self.direction = newDirection;
        })
    }


    setClasses(direction: string) {
        return {
            from: direction === 'from',
            to: direction === 'to',
            active: this.direction === direction
        }
    }


    getAddresses(search: string): Observable<any> {
        if(search.length < 3) return;

        const url = `http://ddtaxity.smarttaxi.ru:8000/1.x/geocode?taxiServiceId=taxity&search=${search}`;

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getAll(address: string) {

        const self = this;

        this.getAddresses(address)
            .subscribe(
                (addresses) => {
                    self.addresses.current = addresses;
                    self.search.current = true;
                },
                error => console.log(error)
            )
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
        this.Place.changeDirection(type);
    }
}



