import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../../models/ride';

@Injectable()
export class RideProvider {

    rides: Array<Ride>;

    constructor() {

    }

    public save(name: string, data: Array<Ride>) {
        
        let dataToSave = JSON.stringify(data);
        localStorage.setItem(name, dataToSave);

    }

    public get(name: string) {
        var array = JSON.parse(localStorage.getItem(name));
        return array;
    }

}
