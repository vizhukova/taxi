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

    //http://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&sensor=true

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


//import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//
///*
//  Generated class for the Place provider.
//
//  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
//  for more info on providers and Angular 2 DI.
//*/
//@Injectable()
//export class Place {
//  data: any;
//
//  constructor(private http: Http) {
//    this.data = null;
//  }
//
//  load() {
//    if (this.data) {
//      // already loaded data
//      return Promise.resolve(this.data);
//    }
//
//    // don't have the data yet
//    return new Promise(resolve => {
//      // We're using Angular Http provider to request the data,
//      // then on the response it'll map the JSON data to a parsed JS object.
//      // Next we process the data and resolve the promise with the new data.
//      this.http.get('path/to/data.json')
//        .map(res => res.json())
//        .subscribe(data => {
//          // we've got back the raw data, now generate the core schedule data
//          // and save the data for later reference
//          this.data = data;
//          resolve(this.data);
//        });
//    });
//  }
//}
//
