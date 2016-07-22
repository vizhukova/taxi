import {Component, NgZone, Output, EventEmitter } from '@angular/core';
import {Place} from './../providers/place/place';

@Component({
    selector: 'address',
    templateUrl: 'build/templates/address_panel.html'
})
export class Address {

    @Output() directionUpdated = new EventEmitter();

    address: any;
    direction: string;

    constructor(private Place: Place, private NgZone: NgZone) {

        const self = this;
        this.address = {from: '', to: ''};
        this.direction = 'from';

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

    onFocus(type: string): void {
        this.Place.changeDirection(type);
    }
}



