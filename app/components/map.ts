import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import * as L from 'leaflet'
import {Place} from './../providers/place/place';

@Component({
    selector: 'map',
    template: ' <div id="mapid"></div>',
    providers: [Place],
    inputs: ['callback']
})
export class Map {

    myMap:any;
    popup:any;
    map: any;

    @Input()
    public callback: Function;

    constructor(private navController:NavController, private PlaceProvider: Place) {
         this.popup = new L.Popup();
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    public ngAfterViewInit(): void {

        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png',
            osmAttribution = '',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        this.map = new L.Map('mapid', {center: new L.LatLng(55.8, 37.7), zoom: 7, layers: [osmLayer], zoomControl:false});

        this.map.on('click', this.onClick);
        this.map.on('dragend', this.onDragEnd);

        setTimeout(()=>{this.map.invalidateSize(true)}, 300);

         this.PlaceProvider.get().then((data: any) => {
              this.map.setView(L.latLng(data.latitude, data.longitude), 16);
             console.log(data.latitude, data.longitude)


        }).catch((err) => {
            //debugger
        })
    }

    private onClick(e) {
        var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';
        this.popup.setLatLng(e.latlng);
    }

    private onDragEnd(e) {
        if(this.callback) {
            this.callback(this.map.getCenter());
        }
    }

}



