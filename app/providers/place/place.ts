import {Geolocation} from 'ionic-native';
import {Injectable, Output, EventEmitter} from '@angular/core';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {Http, Response} from '@angular/http';
import {Coordinates, PathCoordinates} from "../../interfaces/coordinates";

@Injectable()
export class Place {

    data:any;
    address:any;
    coords:PathCoordinates;
    direction:string;
    cbs:Function[];
    pathStatus: boolean;
    fullAddress: Object;

    // Observable data sources
    private addressSource = new BehaviorSubject<any>({from: '', to: ''});
    private coordsSource = new BehaviorSubject<any>({from: [], to: []});
    private directionSource = new BehaviorSubject<any>('from');
    private reloadSource = new BehaviorSubject<any>(true);
    private mapCreateSource = new BehaviorSubject<any>(null);
    private mapDestroySource = new BehaviorSubject<any>(null);

    private pathSource = new BehaviorSubject<any>(true);

    // Observable data streams
    address$ = this.addressSource.asObservable();
    coords$ = this.coordsSource.asObservable();
    direction$ = this.directionSource.asObservable();
    reload$ = this.reloadSource.asObservable();
    mapCreate$ = this.mapCreateSource.asObservable();
    mapDestroy$ = this.mapDestroySource.asObservable();
    path$ = this.pathSource.asObservable();

    // Service message commands
    public changeAddress(address:string) {
        this.addressSource.next(address);
    }

    public getDirection(){
        return this.direction;
    }

    changeCoords(coords:PathCoordinates) {
        this.coordsSource.next(coords);
    }

    changeDirection(direction:string) {
        this.direction = direction;
        this.directionSource.next(direction);
    }

    changePathStatus(status: boolean) {
        this.pathStatus = status;
        this.pathSource.next(status);
    }

    public reloadMap(name) {
        this.reloadSource.next(name);
    }

    public getCurrentCoords(){
        return this.coords;
    }

    constructor(private http:Http) {
        this.coords = <PathCoordinates>{
            from: {latitude: 0, longitude: 0},
            to: {latitude: 0, longitude: 0}
        };
        this.address = {
            from: '',
            to: ''
        };

        this.fullAddress = {
            from: {},
            to: {}
        };
        this.direction = 'from';
        this.cbs = []
    }

    public getPosition() {
        
        var self = this;
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition().then((resp) => {

                let c = resp.coords;

                self.coords[self.direction] = {
                    latitude: c.latitude,
                    longitude: c.longitude
                };
                self.changeCoords(self.coords);
                resolve(self.coords[self.direction]);
            }, (err) => {
                reject(err);
            })
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

    public getCurrentAddress(coords:Coordinates) {

        const self = this;

        self.coords[self.direction] = coords;
        self.changeCoords(self.coords);

        return new Promise((resolve, reject) => {
            self.http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=true&language=ru`)
                .subscribe((res:Response) => {
                    var data = res.json();

                    if(data.results.length){
                        self.address[self.direction] = `${data.results[0].address_components[1].long_name}, ${data.results[0].address_components[0].long_name}`;
                        self.fullAddress[self.direction] = data.results[0];
                        self.changeAddress(self.address);
                    }

                });
        })
    }

    public getFullAddress(direction: string) {
        return {
            city : this.fullAddress[direction].address_components[3].long_name,
            country : this.fullAddress[direction].address_components[6].long_name,
            fullAddress : this.fullAddress[direction].formatted_address,
            shortAddress : this.address[direction],
            lat : this.coords[direction].latitude,
            lon : this.coords[direction].longitude
        };
    }


}
