import {Component, ApplicationRef} from '@angular/core';
import {NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Map } from './../../components/map';
import {Place} from './../../providers/place/place';
// import polyline from 'polyline'


@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [Map],
  providers: [Place]
})
export class HomePage{

    names: string[];
    loading: boolean;
    address: any;
    isAddress: boolean;
    path: any;
    status: any;
    coords: any;
    direction: string;
    theBoundCallback: Function;
    callEnable: Function;

    public ngOnInit(){
        this.theBoundCallback = this.onDragendMap.bind(this);
        this.callEnable = this.enableCall.bind(this);
    }

    constructor(private nav: NavController, private http: Http, private PlaceProvider: Place, private ref: ApplicationRef) {
        this.nav = nav;
        this.http = http;
        this.address = {
            from: '',
            to: ''
        };
        this.status ={
            from: 'определение адреса подачи такси',
            to: 'определение адреса поездки',
        };
        this.coords = {
          from: null,
          to: null
        };
        this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
        this.makeRequest();
        this.isAddress = false;
        this.path = [];
        this.direction = 'from'
    }
    
    enableCall() {
        this.isAddress = true;
    }

    setClasses(direction: string) {
        return {
            from: direction === 'from',
            to: direction === 'to',
            active: this.direction === direction
        }
    }

    markerClasses() {
        return {
            marker: true,
            from: this.direction === 'from'
        }
    }

    onFocus(type: string): void {
        this.direction = type
    }

    makeRequest(): void {
        this.loading = true;
    
        this.PlaceProvider.get().then((coords:any) => {
            
            this.PlaceProvider.getCurrentAddress(coords).then((data:any) => {
                this.address[this.direction] = data;
                this.loading = false;
            }).catch((err) => {
                //debugger
            })
        })
    }

    public onDragendMap(coords) { 
        this.coords[this.direction] = coords;
        
        this.PlaceProvider.getCurrentAddress({latitude: coords.lat, longitude: coords.lng}).then((data:any) => {
            this.address[this.direction] = data;
            this.loading = false;
            this.ref.tick()
        }).catch((err) => {
        
        })
    }
}


