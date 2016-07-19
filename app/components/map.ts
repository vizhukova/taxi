import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import * as L from 'leaflet'
import {Place} from './../providers/place/place';

@Component({
    selector: 'map',
    template: '<div id="mapid"></div>',
    providers: [Place],
    inputs: ['callback', 'path', 'direction', 'coords']
})
export class Map {

    myMap: any;
    popup: any;
    map: any;
    line: any;
    marker: any;
    oldDirection: any;
    icon: any;
    iconTo: any;

    @Input()
    public callback: Function;
    
    @Input()
    public path : any;
    
    @Input()
    public direction : string;
    
    @Input()
    public coords : any;


    ngOnChanges(data: any) {

        if(this.map && this.path.length) {
            this.line && this.removeLayer(this.line);
            this.line = L.polyline(this.path, {color: 'red'}).addTo(this.map);
        }

        if(data.direction && typeof data.direction.previousValue === 'string') {

            let prev = data.direction.previousValue;

            if(this.marker[prev]) this.removeLayer(this.marker[prev]);
            this.marker[prev] = L.marker(this.coords[prev], {icon: prev === 'from' ? this.icon: this.iconTo}).addTo(this.map);
        }
    }

    constructor(private navController:NavController, private PlaceProvider: Place) {
        this.onDragEnd = this.onDragEnd.bind(this);
        this.marker = {
            from: null,
            to: null
        };

        this.icon = L.icon({
                iconUrl: 'build/res/icon_path_active.png',
                iconSize:     [26, 36], // size of the icon
                shadowSize:   [26, 36], // size of the shadow
                iconAnchor:   [26, 36], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 36],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        this.iconTo = L.icon({
                iconUrl: 'build/res/point.png',
                iconSize:     [20, 20], // size of the icon
                shadowSize:   [20, 20], // size of the shadow
                iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 20],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    }

    public ngAfterViewInit(): void {

        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png',
            osmAttribution = '',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        this.map = new L.Map('mapid', {center: new L.LatLng(55.8, 37.7), zoom: 7, layers: [osmLayer], zoomControl:false});

        this.map.on('dragend', this.onDragEnd);
        
        this.map.on('zoomend', this.onDragEnd);

        setTimeout(()=>{this.map.invalidateSize(true)}, 300);

         this.PlaceProvider.get().then((data: any) => {
              this.map.setView(L.latLng(data.latitude, data.longitude), 16);
             console.log(data.latitude, data.longitude)


        }).catch((err) => {
            //debugger
        })
    }

    private removeLayer(layer) {
        this.map.removeLayer(layer)
    }

    private onDragEnd(e) {
        if(this.callback) this.callback(this.map.getCenter());
    }

}



