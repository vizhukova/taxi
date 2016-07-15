import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import * as L from 'leaflet'
import {Place} from './../providers/place/place';

@Component({
    selector: 'map',
    template: ' <div id="mapid"></div>',
    providers: [Place]
})
export class Map {

    myMap:any;

    constructor(private navController:NavController, private PlaceProvider: Place) {

    }

    public ngAfterViewInit(): void {

        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png',
            osmAttribution = '',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        var map = new L.Map('mapid', {center: new L.LatLng(55.8, 37.7), zoom: 7, layers: [osmLayer], zoomControl:false});

        map.on('click', onMapClick);

        setTimeout(function(){map.invalidateSize(true)}, 300);

         this.PlaceProvider.get().then((data: any) => {
              map.setView(L.latLng(data.latitude, data.longitude), 14);
             console.log(data.latitude, data.longitude)


        }).catch((err) => {
            //debugger
        })


        var popup = new L.Popup();

        function onMapClick(e) {

            var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

            popup.setLatLng(e.latlng);

        }

    }

}


