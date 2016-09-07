import {Geolocation} from 'ionic-native';
import {Injectable, Output, EventEmitter} from '@angular/core';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {Http, Response} from '@angular/http';
import {Coordinates, PathCoordinates} from "../../interfaces/coordinates";
import { MapProvider } from "../map/map";
import  * as _ from 'lodash'
declare var cordova:any;

@Injectable()
export class Place {

    data:any;
    detailAddress:any;
    coords:PathCoordinates;
    direction:string;
    cbs:Function[];
    fullAddress: Object;
    dragStart:boolean;

    // Observable data sources
    private detailAddressSource = new BehaviorSubject<any>({from: '', to: ''});
    private coordsSource = new BehaviorSubject<any>({from: [], to: []});
    private reloadSource = new BehaviorSubject<any>(true);
    private mapCreateSource = new BehaviorSubject<any>(null);
    private mapDestroySource = new BehaviorSubject<any>(null);


    // Observable data streams
    detailAddress$ = this.detailAddressSource.asObservable();
    coords$ = this.coordsSource.asObservable();
    reload$ = this.reloadSource.asObservable();
    mapCreate$ = this.mapCreateSource.asObservable();
    mapDestroy$ = this.mapDestroySource.asObservable();

    public changeDetail(address:Object, raw?:any) {

        var value;

        if(!raw) {
            value = this.detailAddressSource.getValue();

            value[this.direction] = address;
        } else {
            value = address
        }

        this.detailAddress = value;

        this.detailAddressSource.next(value);
    }

    public getDirection(){
        return this.direction;
    }

    changeCoords(coords) {
        this.coordsSource.next(coords);
    }

    public reloadMap(name) {
        this.reloadSource.next(name);
    }

    public getCurrentCoords(){
        return this.coords;
    }

    constructor(
        private http:Http, 
        private MapProvider:MapProvider
    ) {
        this.coords = <PathCoordinates>{
            from: {latitude: 0, longitude: 0},
            to: {latitude: 0, longitude: 0}
        };
        this.detailAddress = {
            from: '',
            to: ''
        };

        this.fullAddress = {
            from: {},
            to: {}
        };

        this.MapProvider.state$.subscribe(newState => {
            this.direction = newState.direction;
            this.dragStart = newState.dragStart;
        });

        this.MapProvider.markers$.subscribe(newState => {
            this.coords = newState
        });

        this.cbs = []
    }

    public getPosition() {
        var self = this;

        return new Promise((resolve, reject) => {

            var onSuccess = (position:any) => {
                resolve(position.coords);
            };
            
            cordova && cordova.plugins.locationAccuracy.request(
                (success)=>{
                    Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 20000}).then(onSuccess)
                },
                (error)=>{
                    if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                        if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                    } else if(error==="Location services is already enabled") {
                        Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 20000}).then(onSuccess)
                    }
                },
                cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
            );
        })

    }

    public get(property:string) {
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

    public getAddress() {
        return this.address;
    }

    public getCurrentAddress(coords:Coordinates) {
        const self = this;

        if(!self.detailAddress[self.direction].shortAddress && self.direction === 'to') {
            return;
        }
        self.coords[self.direction] = coords;

        return new Promise((resolve, reject) => {

            // var google = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=true&language=ru`


            self.http.get(`http://ddtaxity.smarttaxi.ru:8000/1.x/reversegeocode?taxiServiceId=taxity&lat=${coords.latitude}&lon=${coords.longitude}`)
                .subscribe((res:Response) => {
                    var data = res.json()[0];

                    if(data){


                        setTimeout(() => {
                            self.changeDetail(data);
                            self.changeCoords(self.coords);
                            self.MapProvider.set('searching', false);
                        }, 300)

                    }

                });
        })
    }

    public getFullAddress(direction: string) {

        return {
            city : this.detailAddress[direction].city,
            country : this.detailAddress[direction].country,
            fullAddress: this.detailAddress[direction].fullAddress,
            housing: this.detailAddress[direction].housing,
            shortAddress : this.detailAddress[direction].shortAddress,
            lat : this.coords[direction].latitude,
            lon : this.coords[direction].longitude
        };
    }


}
