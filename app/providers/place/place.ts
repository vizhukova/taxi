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

    public decodeGooglePolyline(encoded_polylines: string, initial_capacity: number) {
        var trucks = [];
        var truck = 0;
        var carriage_q = 0;
        for (var x = 0, xx = encoded_polylines.length; x < xx; ++x) {
            var i = encoded_polylines.charCodeAt(x);
             i -= 63;
            var _5_bits = i << (32 - 5) >>> (32 - 5);
            truck |= _5_bits << carriage_q;
            carriage_q += 5;
            var is_last = (i & (1 << 5)) == 0;
            if (is_last) {
                var is_negative = (truck & 1) == 1;
                truck >>>= 1;
                if (is_negative) {
                    truck = ~truck;
                }
                trucks.push(truck);
                carriage_q = 0;
                truck = 0;
            }
        }
        return trucks;
    }


//public class Test {
//    public static void main(String args[]) {
//        for (int point : Decode("_p~iF~ps|U_ulLnnqC_mqNvxq`@",10)) {
//            System.out.println(point); // Be aware that point is in E5
//        }
//    }

    //private static java.util.List<java.lang.Integer> Decode(String encoded_polylines, int initial_capacity) {
    //    java.util.List<java.lang.Integer> trucks = new java.util.ArrayList<java.lang.Integer>(initial_capacity);
    //    int truck = 0;
    //    int carriage_q = 0;
    //    for (int x = 0, xx = encoded_polylines.length(); x < xx; ++x) {
    //        int i = encoded_polylines.charAt(x);
    //        i -= 63;
    //        int _5_bits = i << (32 - 5) >>> (32 - 5);
    //        truck |= _5_bits << carriage_q;
    //        carriage_q += 5;
    //        boolean is_last = (i & (1 << 5)) == 0;
    //        if (is_last) {
    //            boolean is_negative = (truck & 1) == 1;
    //            truck >>>= 1;
    //            if (is_negative) {
    //                truck = ~truck;
    //            }
    //            trucks.add(truck);
    //            carriage_q = 0;
    //            truck = 0;
    //        }
    //    }
    //    return trucks;
    //}

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
