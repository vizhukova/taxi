import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import * as L from 'leaflet'
import {Place} from './../providers/place/place';

@Component({
    selector: 'map',
    template: '<div id="mapid"></div>'
})

export class Map {

    map: any;
    polyline: any;
    iconFrom: any;
    iconTo: any;
    pathBtn: any;
    marker: any;
    markerTo: any;
    markerFrom: any;

    @Input() callback: Function;
    @Input() path : any;
    @Input() direction : string;
    @Input() coords : any;
    @Input() callEnable : Function;

    ngOnChanges(data: any) {
        // if(data.direction && typeof data.direction.previousValue === 'string') {
        //
        //     let curent = data.direction.currentValue;
        //     let prev = data.direction.previousValue;
        //     let icon = prev === 'from' ? this.icon: this.iconTo;
        //
        //     if(this.marker[curent]) this.removeLayer(this.marker[curent]);
        //     this.marker[prev] = L.marker(this.coords[prev], {icon: icon}).addTo(this.map);
        // }

    }

    constructor(private PlaceProvider: Place, private http: Http) {
        this.onDragEnd = this.onDragEnd.bind(this);
        this.marker = {
            from: null,
            to: null
        };
        const self = this;

        this.iconFrom = L.icon({
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

        this.pathBtn = L.Control.extend({//кнопки навигации

            options: {
                position: 'bottomright'
            },

            onAdd: function (map) {

                var container = L.DomUtil.create('div', 'nav-panel');
                var locate = L.DomUtil.create('div', 'locate-button', container);
                var path = L.DomUtil.create('div', 'calcpath-button', container);

                path.addEventListener('click', () => { self.calcPolyline(self.coords) });
                locate.addEventListener('click', () => { self.locateMe()});

                return container;
            }
        });

        this.markerTo = L.marker([0, 0])
        this.markerFrom = L.marker([0, 0])

        PlaceProvider.coords$.subscribe(newCoords => {
            self.coords = newCoords;
        });

        PlaceProvider.direction$.subscribe(newDirection => {
            if(newDirection === 'to' && self.coords.from && self.coords.from.length) {
                self.markerTo.setLatLng(L.latLng(self.coords.from[0], self.coords.from[1]));
                self.markerTo.setOpacity(1);
                self.markerFrom.setOpacity(0);
            } else if(self.coords.to && self.coords.to.length) {
                self.markerFrom.setLatLng(L.latLng(self.coords.to[0], self.coords.to[1]));
                self.markerTo.setOpacity(0);
                self.markerFrom.setOpacity(1);
            }
        });
    }

    public ngAfterViewInit(): void {

        var osmUrl = 'http://tiles.maps.sputnik.ru//{z}/{x}/{y}.png',
            osmAttribution = '',
            osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        this.map = new L.Map('mapid', {center: new L.LatLng(55.8, 37.7), zoom: 7, layers: [osmLayer], zoomControl:false});

        this.map.on('dragend', this.onDragEnd);
        
        this.map.on('zoomend', this.onDragEnd);

        this.map.addControl(new this.pathBtn());

        this.markerTo = L.marker([0, 0], {icon: this.iconFrom, opacity: 0}).addTo(this.map);
        this.markerFrom = L.marker([0, 0], {icon: this.iconTo, opacity: 0}).addTo(this.map);

        setTimeout(()=>{this.map.invalidateSize(true)}, 300);

        this.locateMe()
    }

    private calcPolyline(coords:any) {

        if(!coords.from || !coords.to) return;

        let from = {Lat: coords.from[0], Lon: coords.from[1]};

        let to = {Lat : coords.to[0], Lon: coords.to[1]};

        this.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])
            
        .subscribe((res: Response) => {
            var data = res.json();
            
            this.markPolyline(this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline))
        });
    }

    private locateMe() {
        this.PlaceProvider.getPosition().then((data: any) => {
            this.map.setView(L.latLng(data.latitude, data.longitude), 16);
            this.onDragEnd()
        }).catch((err) => {
            //debugger
        })
    }
    
    private markPolyline(path: any) {
        this.polyline && this.removeLayer(this.polyline);
        this.polyline = L.polyline(path, {color: 'black'}).addTo(this.map);
        this.callEnable();
    }

    private removeLayer(layer) {
        this.map.removeLayer(layer)
    }

    private onDragEnd() {

        let zoom = this.map.getZoom();
        this.map.setZoom(Math.round(zoom));

        if(this.callback) this.callback(this.map.getCenter());
    }

}



