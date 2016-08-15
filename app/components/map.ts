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
        <div class="btn locate" (click)="locateMe()"></div>
        <div (click)="boundsPolyline()" *ngIf="coords.to.latitude" class="btn center"></div>
    </div>`
})

export class Map {

    map:any;
    polyline:any;
    iconFrom:any;
    iconTo:any;
    markerTo:any;
    markerFrom:any;
    coords:any;
    state: MapState;
    pathButton: any;
    timer: any;


    @Input() callback:Function;
    @Input() editable:boolean;
    @Input() path:any;
    @Input() selector:string;
    @Input() callEnable:Function;


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

        this.markerTo = L.marker([0, 0], {icon: this.iconTo, opacity: 1});
        this.markerFrom = L.marker([0, 0], {icon: this.iconFrom,  opacity: 1});

        MapProvider.state$.subscribe(newState => {


            if(!this.state.direction && newState.direction) {
                this.addMarker(newState.direction);
            } else if(newState.direction && this.state.direction !== newState.direction) {
                this.addMarker(this.state.direction);
            }

            this.state = _.assign({}, newState);

            setTimeout(() => {
                self.state = _.assign({}, MapProvider.getState());
                     self.ref.tick();
            }, 300);


        });

        
        PlaceProvider.coords$.subscribe(newCoords => {


            this.MapProvider.set('searching', false);

           self.coords = newCoords;

            this.calcPolyline(newCoords);

            if (this.map && newCoords && this.state.direction) {

                let currentCoordinates = newCoords[this.state.direction];

                this.map.setView([
                    currentCoordinates.latitude,
                    currentCoordinates.longitude
                ]);

                //this.ref.tick();
                //setTimeout(() => {
                //    self.ref.tick();
                //    self.map.invalidateSize(true);
                //}, 300)
            }

        });

        //PlaceProvider.reload$.subscribe(name => {
        //    if (self.map && self.selector === name) {
        //        setTimeout(()=> {
        //            self.map.invalidateSize(true);
        //            self.locateMe();
        //        }, 300);
        //    }
        //});
        //

        //
        //PlaceProvider.mapCreate$.subscribe(name => {
        //    self.createMap(name)
        //});
        //
        //PlaceProvider.mapDestroy$.subscribe(name => {
        //    self.destroyMap(name)
        //});
    }

    addMarker(direction: string) {


        if(this.polyline && this.map.hasLayer(this.markerTo) && this.map.hasLayer(this.markerFrom)) {
            switch(direction) {
                case 'to':
                    this.map.removeLayer(this.markerTo);
                    //this.markerTo.setOpacity(0);
                    this.map.setView(this.markerTo.getLatLng());
                    break;

                case 'from':
                    this.map.removeLayer(this.markerFrom);
                    //this.markerFrom.setOpacity(0);
                    this.map.setView(this.markerFrom.getLatLng());
            }

            return
        }

        var coords = this.coords[direction].latitude ?
                     Map.coordinatesToArray(this.coords[direction]) :
                     this.map.getCenter();

        switch(direction) {
            case 'to':
                //this.markerFrom.setOpacity(0);
                //this.markerTo.setOpacity(1);
                if(this.polyline) this.map.setView(this.markerFrom.getLatLng());
                this.map.removeLayer(this.markerFrom);
                this.markerTo.setLatLng(coords);
                this.markerTo.addTo(this.map);
                break;
            case 'from':
                if(this.polyline) this.map.setView(this.markerTo.getLatLng());
                this.map.removeLayer(this.markerTo);
                this.markerFrom.setLatLng(coords);
                this.markerFrom.addTo(this.map);
                //this.markerTo.setOpacity(0);
                //this.markerFrom.setOpacity(1);
                break;
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

    private static coordinatesToArray(coordinates:Coordinates) {
       return [coordinates.latitude || 0, coordinates.longitude || 0]
    }

    //private isPointExist(name: string): boolean {
    //    let point = this.coords[name];
    //
    //    return point.latitude !== 0 && point.longitude !== 0;
    //}


    public ngAfterViewInit():void {
        this.createMap(this.selector);
    }

    private timeout(){

        if(!this.coords.to.latitude && this.state.direction === 'to' ) return;
        if(!this.state.direction) return;

        if(this.timer) clearTimeout(this.timer);

        this.timer = setInterval(() => {
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

        if (!this.map) {
            this.map = new L.Map(this.selector, {center: mapCoords, zoom: 15, layers: [osmLayer], zoomControl: false});

            //this.markerFrom.addTo(this.map);
            //this.markerTo.addTo(this.map)
        }

        //this.map.on('click', () => {
        //    if(cordova){
        //        cordova.plugins.Keyboard.close();
        //    }
        //});
        //
        //this.map.on('dragstart', () => {
        //    if(cordova){
        //        cordova.plugins.Keyboard.close();
        //    }
        //})
        //
        //

        this.map.on('click', ()=>{
            this.MapProvider.set('clicked', !this.state.clicked)
        });

        if (!this.editable) this.map.on('dragstart', () =>{
            if(this.state.direction) this.MapProvider.set('searching', true)
        });

        if (!this.editable) this.map.on('dragend', this.timeout);

        if (!this.editable) this.map.on('zoomstart', () =>{
            if(this.state.direction) this.MapProvider.set('searching', true)
        });

        if (!this.editable) this.map.on('zoomend', this.timeout);


        //this.bootMarkers(this.direction);

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

    private calcPolyline(coords:any):void {

        if (!coords.from || !coords.to) return;

        let from = {Lat: coords.from.latitude, Lon: coords.from.longitude};

        let to = {Lat: coords.to.latitude, Lon: coords.to.longitude};

        if (!from.Lat || !from.Lon || !to.Lat || !to.Lon) return;

        // this.pathButton.classList.add('loading');

        console.log(from, to);


        this.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])

            .subscribe((res:Response) => {
                var data = res.json();

                this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline));
            });
    }

    private boundsPolyline() {
        if(!this.state.direction) return;
        if(this.state.direction === 'to') {
            this.markerTo.setLatLng(this.map.getCenter());
            //this.markerTo.setOpacity(1);
            this.markerTo.addTo(this.map);
        } else if(this.state.direction === 'from') {
            this.markerFrom.setLatLng(this.map.getCenter());
            //this.markerFrom.setOpacity(1);
            this.markerFrom.addTo(this.map);
        }
        this.MapProvider.set('direction', '');
        this.map.fitBounds(this.polyline.getBounds(), {padding: [50, 50]});
    }

    private locateMe():void {

        if(!this.coords.to.latitude && this.state.direction === 'to') return;

        this.MapProvider.set('searching', true);

        this.PlaceProvider.getPosition().then((data:Coordinates) => {
            this.map.setView(L.latLng(data.latitude, data.longitude), 16);

            this.MapProvider.set('searching', false);

            this.ref.tick();
            this.onDragEnd();
            this.map.invalidateSize(true);
        }).catch((err) => {
            //debugger
        })
    }

        //this.cost.getCost()


    private markPolyline(path:any):void {
        this.polyline && this.removeLayer(this.polyline);
        this.polyline = L.polyline(path, {color: 'black'}).addTo(this.map);
        this.callEnable(true);
        this.PlaceProvider.changePathStatus(true);
        console.log('PlaceProvider.changePathStatus(true)')
    }

    private removeLayer(layer):void {
        this.map.removeLayer(layer);
        this.polyline = false;
    }

    private onDragEnd():void {

        let zoom = this.map.getZoom();
        this.map.setZoom(Math.round(zoom));

        const coords = this.map.getCenter();

        this.PlaceProvider.getCurrentAddress(<Coordinates>{
            latitude: coords.lat,
            longitude: coords.lng
        });

        if (this.polyline) {
            this.removeLayer(this.polyline);
            this.PlaceProvider.changePathStatus(false);
            this.callEnable(false);
        }

        this.map.invalidateSize(true)
    }

    public ngOnDestroy():void {
        this.destroyMap(this.selector)
    }

}



