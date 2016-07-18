import {Geolocation} from 'ionic-native';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Response, RequestOptions, Headers} from '@angular/http';

@Injectable()
export class Place {

    data:any;

    constructor(private http:Http) {

    }

    public get() {

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition().then((resp) => {
                this.data = resp;
                resolve(resp.coords);
                //resp.coords.latitude
                //resp.coords.longitude
            }, (err) => {
                reject(err);
            })
        })

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
        return new Promise((resolve, reject) => {
            //this.get().then((coords:any) => {
                this.http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=true&language=ru`)
                    .subscribe((res:Response) => {
                        var data = res.json();
                        resolve(`${data.results[0].address_components[1].long_name}, ${data.results[0].address_components[0].long_name}`);
                    });
            //})
        })
    }



    public watch(callback) {
        let watch = Geolocation.watchPosition();
        watch.subscribe((data) => {
            callback(data);
            //data.coords.latitude
            //data.coords.longitude
        })
    }

}
