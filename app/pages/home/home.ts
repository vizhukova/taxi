import {Component} from '@angular/core';
import {NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Map } from './../../components/map';
import {Place} from './../../providers/place/place';

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

  constructor(private navController: NavController, private http: Http, private PlaceProvider: Place, private zone: NgZone) {
    this.http = http;
    this.title = 'определяем адрес...';
    this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
    this.makeRequest();
    this.isAddress = false;
  }



  makeRequest(): void {
    this.loading = true;

    //this.http.request('http://jsonplaceholder.typicode.com/posts')
    //.subscribe((res: Response) => {
    //  this.loading = false;
    //    this.names = res.json();
    //});


    this.PlaceProvider.get().then((coords:any) => {
       this.PlaceProvider.getCurrentAddress(coords).then((data:any) => {
          this.title = data;
          this.isAddress = true;
         this.loading = false;
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
        this.zone.run(()=>{});
    }).catch((err) => {
    })
  }
}


