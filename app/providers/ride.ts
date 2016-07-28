import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../models/ride';

@Injectable()
export class RideProvider {

    constructor() {

    }

    public save(array: Array<Ride>) {

        let dataToSave = JSON.stringify(array);
        localStorage.setItem('rides', dataToSave);

    }

    public get() {
        var array = JSON.parse(localStorage.getItem('rides'));
        return array;
    }

}
