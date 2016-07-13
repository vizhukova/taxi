import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
declare var L:any;
import { Place } from './../providers/place/place';

@Component({
    selector: 'map',
  template: ' <div id="mapid"></div>'
})
export class Map {

  myMap:any;
  private PlaceProvider: Place;

  constructor(private navController: NavController) {

  }

  Initialize() {

    this.PlaceProvider.get();

    this.myMap = L.map('mapid').setView([51.505, -0.09], 13);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'your.mapbox.project.id',
        accessToken: 'your.mapbox.public.access.token'
    }).addTo(this.myMap);
  }


}


