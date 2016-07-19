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
    coords: any;
    direction: string;

    public theBoundCallback: Function;

    public ngOnInit(){
        this.theBoundCallback = this.onDragendMap.bind(this);
    }

    constructor(private nav: NavController, private http: Http, private PlaceProvider: Place, private ref: ApplicationRef) {
        this.nav = nav;
        this.http = http;
        this.address = {
            from: '',
            to: ''
        };
        this.coords = {
          from: [],
          to: []
        };
        this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
        this.makeRequest();
        this.isAddress = false;
        this.path = [];
        this.direction = 'from'
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
            
            this.makePolyline(coords);

            this.PlaceProvider.getCurrentAddress(coords).then((data:any) => {
                this.address[this.direction] = data;
                this.isAddress = true;
                this.loading = false;
            }).catch((err) => {
                //debugger
            })
        })

  }
    
  protected makePolyline(coords:any) {

      let offset = Math.random() / 10;

      

      let from = {Lat: coords.lat, Lon: coords.lng};

      let to = {Lat : from.Lat + offset, Lon: from.Lon + offset};

      this.http.post('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', [from, to])
          .subscribe((res:Response) => {
              var data = res.json();
              this.path = this.PlaceProvider.decodeGooglePolyline(data.overviewPolyline);
      });
  }

  public onDragendMap(coords) { //lat; lng
    this.makePolyline(coords);
    this.coords[this.direction] = coords;
    this.PlaceProvider.getCurrentAddress({latitude: coords.lat, longitude: coords.lng}).then((data:any) => {
        this.address[this.direction] = data;
        this.isAddress = true;
        this.loading = false;
        this.ref.tick()
    }).catch((err) => {

    })
  }
}


