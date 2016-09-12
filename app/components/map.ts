import {Component, ApplicationRef} from '@angular/core';
import {Input} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import * as L from 'leaflet'
import * as _ from 'lodash'
import {Place} from './../providers/place/place';
import {Cost} from './../providers/cost/cost';
import { MapProvider } from './../providers/map/map';
import {Nav} from "./../providers/nav/nav";
import {Coordinates, PathCoordinates} from "../interfaces/coordinates";
import { MapState } from "../interfaces/map";
declare var cordova: any;

@Component({
    selector: 'map',
    template: `<div id="map-wrap">
        <span *ngIf="state.direction" [ngClass]="markerClasses()"></span>
        <div id="{{selector}}"></div>
        <div *ngIf="state.direction" [ngClass]="setBtnClasses()" class="btn locate" (click)="locateMe()"></div>
        <div [ngClass]="setBoundsClasses()" (click)="boundsPolyline()" *ngIf="coords.to.latitude && !state.onmapsearch" class="btn center"></div>
        <div *ngIf="state.error" class="error-wrap">Ошибка цены <span (click)="hideError()" class="hide">OK</span></div>
        <div *ngIf="state.onmapsearch && !state.searching" [ngClass]="setCallClasses()" (click)="onMapsearchOff()">
            <p class="title">Далее</p>
        </div>
    </div>`
})

export class Map {

    map:any;
    polyline:any;
    iconFrom:any;
    iconTo:any;
    coords:any;
    error: boolean;
    state: MapState;
    pathButton: any;
    timer: any;
    dragCoordsChange: boolean;
    markers: any = {
        from: {latitude: 0, longitude: 0},
        to: {latitude: 0, longitude: 0}
    };


    @Input() callback:Function;
    @Input() editable:boolean;
    @Input() path:any;
    @Input() selector:string;
    //@Input() callEnable:Function;


    constructor(
        private PlaceProvider:Place,
        private MapProvider:MapProvider,
        private http:Http,
        private cost:Cost,
        private ref: ApplicationRef,
        private NavProvider: Nav
    ) {

        this.onDragEnd = this.onDragEnd.bind(this);
        this.timeout = this.timeout.bind(this);

        this.coords = <PathCoordinates>{
            from: {latitude: 0, longitude: 0},
            to: {latitude: 0, longitude: 0}
        };

        const self = this;

        this.state = {direction: 'from'};

        this.iconFrom = L.icon({
            iconUrl: 'build/res/icon_path_active.png',
            iconSize: [26, 36], // size of the icon
            shadowSize: [26, 36], // size of the shadow
            iconAnchor: [15, 19], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 36],  // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        this.iconTo = L.icon({
            iconUrl: 'build/res/point.png',
            iconSize: [20, 20], // size of the icon
            shadowSize: [20, 20], // size of the shadow
            iconAnchor: [11, 11], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 20],  // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        this.markers.to = L.marker([0, 0], {icon: this.iconTo, opacity: 1});
        this.markers.from = L.marker([0, 0], {icon: this.iconFrom,  opacity: 1});

        MapProvider.state$.subscribe(newState => {

            if(!this.state.direction && newState.direction) {
                this.addMarker(newState.direction);
            } else if(newState.direction && this.state.direction !== newState.direction) {
                this.addMarker(this.state.direction);
            }

            if(this.state.onmapsearch && !newState.onmapsearch) {
                this.state = _.assign({}, newState);
                this.calcPolyline(this.coords)
                .then((data:any)=>{this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline))})
            }

            this.state = _.assign({}, newState);

            setTimeout(() => {
                self.state = _.assign({}, MapProvider.getState());
                     self.ref.tick();
            }, 300);
        });




        MapProvider.markers$.subscribe(newMarkers => {
              for(let marker in newMarkers) {
                  if(!newMarkers[marker].latitude) return;
                  this.map.removeLayer(this.markers[marker]);
                  this.markers[marker].setLatLng(Map.coordinatesToArray(newMarkers[marker]));
                  this.markers[marker].addTo(this.map);
              }

            this.coords = newMarkers;
             this.calcPolyline(newMarkers)
            .then((data:any)=>{return this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline))})
            .then(()=>{this.boundsPolyline()})
            .catch((err) => { console.log(err) })
        });

        PlaceProvider.reload$.subscribe(newCoords => {
                 if(this.map) this.map.invalidateSize(true)
        });


            PlaceProvider.coords$.subscribe(newCoords => {
            
           self.coords = newCoords;

            if(this.polyline && newCoords.to.latitude === 0) {
                this.removeLayer(this.polyline);
                this.removeLayer(this.markers.to);
                this.map.setView(this.markers.from.getLatLng(), this.roundZoom());
                return;
            }

            this.calcPolyline(newCoords)
            .then((data:any)=>{this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline))})

            if (this.map && newCoords && this.state.direction) {

                let currentCoordinates = newCoords[this.state.direction];

                if(!this.dragCoordsChange) {
                    this.map.setView([
                        currentCoordinates.latitude,
                        currentCoordinates.longitude
                    ], 16, {reset: true});
                }
                this.dragCoordsChange = false;
            }

        });
    }

    hideError() {
        this.MapProvider.set('error', false);
    }

    roundZoom() {
        return Math.round(this.map.getZoom())
    }
    
    addMarker(direction: string) {


        if(this.polyline && this.map.hasLayer(this.markers.to) && this.map.hasLayer(this.markers.from)) {
            switch(direction) {
                case 'to':
                    this.map.removeLayer(this.markers.to);
                    //this.markers.to.setOpacity(0);
                    this.map.setView(this.markers.to.getLatLng(), this.roundZoom());
                    break;

                case 'from':
                    this.map.removeLayer(this.markers.from);
                    //this.markers.from.setOpacity(0);
                    this.map.setView(this.markers.from.getLatLng(), this.roundZoom());
            }

            return
        }

        var coords = this.coords[direction].latitude ?
                     Map.coordinatesToArray(this.coords[direction]) :
                     this.map.getCenter();

        if(!coords[0]) {
            this.map.removeLayer(this.markers.from);
            this.map.removeLayer(this.markers.to);
            return;
        }

        switch(direction) {
            case 'to':
                if(this.polyline) this.map.setView(this.markers.from.getLatLng(), this.roundZoom());
                this.map.removeLayer(this.markers.from);
                this.markers.to.setLatLng(coords);
                this.markers.to.addTo(this.map);
                break;
            case 'from':
                if(this.polyline) this.map.setView(this.markers.to.getLatLng(), this.roundZoom());
                this.map.removeLayer(this.markers.to);
                this.markers.from.setLatLng(coords);
                this.markers.from.addTo(this.map);
                break;
        }
    }

    setBoundsClasses() {
        return {
            btn: true,
            center: true,
            opacity: this.state.searching
        }
    }
    
    markerClasses():Object {
        return {
            marker: true,
            from: this.state.direction === 'from',
            searching: this.state.searching,
            hide: this.state.direction === 'to' && !this.coords.to.latitude
        }
    }

    setBtnClasses() {
        return {
            btn: true,
            locale: true,
            opacity: this.state.searching
        }
    }

    setCallClasses() {
        return {
            call: true,
            active: !this.state.searching && this.state.cost && !this.state.onmapsearch,
            next: this.state.onmapsearch
        }
    }

    onMapsearchOff() {
        this.MapProvider.set('onmapsearch', false);
    }

    private static coordinatesToArray(coordinates:Coordinates) {
       return [coordinates.latitude || 0, coordinates.longitude || 0]
    }

    public ngAfterViewInit():void {
        setTimeout(()=>{
            this.createMap(this.selector);
        }, 300)
    }

    private timeout(){

        if(!this.coords.to.latitude && this.state.direction === 'to' ) return;
        if(!this.state.direction) return;

        if(this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.onDragEnd();
            clearTimeout(this.timer)
        }, 1200)

    }

    private createMap(name:string):void {

        if (this.selector !== name) return;

        const osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png',
            osmAttribution = '',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        // Город родной - Питер я твой! [59.928848, 30.311303]
        let mapCoords = this.coords[this.state.direction].length ? this.coords[this.state.direction] : [59.928848, 30.311303];


        let options = {
            center: mapCoords,
            zoom: 15,
            layers: [osmLayer],
            zoomControl: false
        };
        
        if (!this.map) this.map = new L.Map(this.selector, options);

        this.map.on('dragstart', () =>{

            if(cordova && cordova.plugins && cordova.plugins.Keyboard){
                cordova.plugins.Keyboard.close();
            }

            if(this.state.direction) {
                clearTimeout(this.timer);
                this.MapProvider.set('cost', false);
                this.MapProvider.set('searching', true);
            }
        });

       this.map.on('dragend', ()=>{
            this.timeout()
        });


        this.map.on('drag', ()=>{
            if(this.state.direction) {
                this.MapProvider.set('searching', true)
            }
        });
        //
        // this.map.on('resize', ()=>{
        //     this.map.invalidateSize(true)
        // });
        //
        // this.map.on('viewreset', ()=>{
        //     this.map.invalidateSize(true)
        // });


        this.map.on('zoomstart', () =>{
            if(this.state.direction) {
                clearTimeout(this.timer);
                this.MapProvider.set('cost', false);
            }
        });

        this.map.on('zoomend', this.timeout);

        setTimeout(()=> {
            this.map.invalidateSize(true)
        }, 300);

        if (this.state.initial) this.locateMe()

    }

    private destroyMap(name:string):void {

        let map = this.map;

        if (!map || this.selector !== name) return;

        try {
            map.clearAllEventListeners();

            map.eachLayer(layer => {
                map.removeLayer(layer);
            });

            map.remove();
        } catch (e) {

        }
    }

    private calcPolyline(coords:any) {
        var self = this;
        return new Promise((resolve, reject)=>{
            if (!coords.from || !coords.to || self.state.onmapsearch) return;
            if (coords.from.latitude === coords.to.latitude && coords.from.longitude === coords.to.longitude) return;

            let from = {Lat: coords.from.latitude, Lon: coords.from.longitude};

            let to = {Lat: coords.to.latitude, Lon: coords.to.longitude};

            if (!from.Lat || !from.Lon || !to.Lat || !to.Lon) return;

            self.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])

                .subscribe((res:Response) => {
                    var data = res.json();
                    resolve(data);
                    //this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline));
                });
        })
    }

    private boundsPolyline() {
        if(this.state.searching || !this.polyline) return;
        if(!this.state.direction) {
            this.map.fitBounds(this.polyline.getBounds(), {padding: [30, 30]});
            return
        }

        if(this.state.direction === 'to') {
            this.markers.to.setLatLng(this.map.getCenter());
            //this.markers.to.setOpacity(1);
            this.markers.to.addTo(this.map);
        } else if(this.state.direction === 'from') {
            this.markers.from.setLatLng(this.map.getCenter());
            //this.markers.from.setOpacity(1);
            this.markers.from.addTo(this.map);
        }

        this.MapProvider.set('direction', '');
        setTimeout(()=>{
            this.map.fitBounds(this.polyline.getBounds(), {padding: [30, 30]});
        }, 300)
    }

    private locateMe():void {

        // if(!this.coords.to.latitude && this.state.direction === 'to') return;

        this.MapProvider.set('searching', true);


        this.PlaceProvider.getPosition()
            .then((data:Coordinates)=>{this.PlaceProvider.getCurrentAddress(data)})
            .catch((err) => {})
    }

    private markPolyline(path:any):void {
        this.polyline && this.removeLayer(this.polyline);
        this.polyline = L.polyline(path, {color: 'black'}).addTo(this.map);
        this.map.invalidateSize(true);
        Promise.resolve(true);
    }

    private removeLayer(layer):void {
        this.map.removeLayer(layer);
        this.polyline = false;
    }

    private onDragEnd():void {

        let zoom = this.map.getZoom();
        this.map.setZoom(Math.round(zoom));

        const coords = this.map.getCenter();

        this.dragCoordsChange = true;
        this.PlaceProvider.getCurrentAddress(<Coordinates>{
            latitude: coords.lat,
            longitude: coords.lng
        });

        if (this.polyline) {
            this.removeLayer(this.polyline);
        }

        this.map.invalidateSize(true)
    }

    public ngOnDestroy():void {
        this.destroyMap(this.selector)
    }

}



