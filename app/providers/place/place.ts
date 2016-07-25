import {Geolocation} from 'ionic-native';
import { Injectable, Output, EventEmitter } from '@angular/core';
// import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';

@Injectable()
export class Place {

    data:any;
    address: any;
    coords: any;
    direction: string;

    // Observable data sources
    private addressSource = new Subject<any>();
    private coordsSource = new Subject<any>();
    private directionSource = new Subject<any>();

    // Observable data streams
    address$ = this.addressSource.asObservable();
    coords$ = this.coordsSource.asObservable();
    direction$ = this.directionSource.asObservable();

    // Service message commands
    changeAddress(address: string) {
        this.addressSource.next(address);
    }
    
    changeCoords(coords: any) {
        debugger
        this.coordsSource.next(coords);
    }
    
    changeDirection(direction: any) {
        this.direction = direction;
        this.directionSource.next(direction);
    }

    constructor(private http: Http) {
        this.coords = {
            from: null,
            to: null
        };
        this.address = {
            from: '',
            to: ''
        };
        this.direction = 'from'
    }

    public getPosition() {
        var self = this;
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition().then((resp) => {
                self.coords[self.direction] =  resp.coords;
                self.changeCoords(self.coords);
                resolve(self.coords[self.direction]);
            }, (err) => { reject(err); })
        })

    }

    public get(property: string) {
        return this[property]
    }

    public decodeGooglePolyline(str:string, precision?:number) {
        
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    }

    public getCurrentAddress(coords:any) {

        const self = this;

        debugger
        self.coords[self.direction] = [coords.latitude, coords.longitude];
        self.changeCoords(self.coords);

        return new Promise((resolve, reject) => {
            self.http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=true&language=ru`)
                .subscribe((res:Response) => {
                    var data = res.json();
                    self.address[self.direction] = `${data.results[0].address_components[1].long_name}, ${data.results[0].address_components[0].long_name}`
                    self.changeAddress(self.address);
                });
        })
    }

    // public watch(callback) {
    //     let watch = Geolocation.watchPosition();
    //     watch.subscribe((data) => {
    //         callback(data);
    //         //data.coords.latitude
    //         //data.coords.longitude
    //     })
    // }

}
