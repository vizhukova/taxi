import {Component} from '@angular/core';
import {NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Map } from './../../components/map';
import {Place} from './../../providers/place/place';
import * as polyline from 'polyline'

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [Map],
  providers: [Place]
})
export class HomePage {

  names: string[];
  loading: boolean;
  title: string;
  isAddress: boolean;

  public theBoundCallback: Function;

  public ngOnInit(){
    this.theBoundCallback = this.onDragendMap.bind(this);
  }

  constructor(private navController: NavController, private http: Http, private PlaceProvider: Place) {
    this.http = http;
    this.title = 'определяем адрес...';
    this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
    this.makeRequest();
    this.isAddress = false;
  }



  makeRequest(): void {
    this.loading = true;

        this.PlaceProvider.get().then((coords:any) => {
            this.PlaceProvider.getCurrentAddress(coords).then((data:any) => {
                this.title = data;
                this.isAddress = true;
                this.loading = false;

                this.http.put('http://ddtaxity.smarttaxi.ru:8000/1.x/route?taxiserviceid=taxity', '', {
                        data: JSON.stringify([
                            {Lat: 55.779219, Lon: 37.583033},
                            {Lat: 55.731180, Lon: 37.677409}
                        ])
                    })
                    .subscribe((res:Response) => {
                        var data = res.json();
                        var decodedPolyline = polyline.decode(data.overviewPolyline);
                        debugger;
                    });

            }).catch((err) => {
                //debugger
            })
        })

  }

  public onDragendMap(coords) { //lat; lng
    this.title = 'определяем адрес...';
    this.PlaceProvider.getCurrentAddress({latitude: coords.lat, longitude: coords.lng}).then((data:any) => {
        this.title = data;
        this.isAddress = true;
        this.loading = false;
    }).catch((err) => {

    })
  }
}


