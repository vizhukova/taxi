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
    // private PlaceProvider:Place;

    constructor(private navController:NavController, private PlaceProvider: Place) {

    }

    public ngAfterViewInit(): void {

        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttribution = 'Map data <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>; contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        var map = new L.Map('mapid', {center: new L.LatLng(55.8, 37.7), zoom: 7, layers: [osmLayer]});
        var baseMaps = {

            "OpenStreetMap": osmLayer

        };

        var greenIcon = L.icon({
            iconUrl: './build/res/point.png',

            iconSize:     [15, 15], // size of the icon
            shadowSize:   [15, 15], // size of the shadow
            iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
            shadowAnchor: [15, 15],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        map.on('click', onMapClick);

        setTimeout(function(){map.invalidateSize(true)}, 300);

         this.PlaceProvider.get().then((data: any) => {
              map.setView(L.latLng(data.latitude, data.longitude), 14);
              L.marker([data.latitude, data.longitude], {icon: greenIcon}).addTo(map);
        }).catch((err) => {
            //debugger
        })

        //map.invalidateSize(true);

        //map._onResize(() => {
        //    map.invalidateSize(true);
        //})

        var popup = new L.Popup();

        function onMapClick(e) {

            var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

            popup.setLatLng(e.latlng);

            popup.setContent("Координаты точки " + latlngStr);

            map.openPopup(popup);

            //this.myMap = L.map('mapid').setView([51.505, -0.09], 13);
            //L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            //    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            //    maxZoom: 18,
            //    id: 'your.mapbox.project.id',
            //    accessToken: 'your.mapbox.public.access.token'
            //}).addTo(this.myMap);
        }

    }

}


