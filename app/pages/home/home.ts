import {Component} from '@angular/core';
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

  constructor(private navController: NavController, private http: Http, private PlaceProvider: Place) {
    this.http = http;
    this.title = 'определяем адрес...';
    this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
    this.makeRequest();
  }



  makeRequest(): void {
    this.loading = true;

    this.http.request('http://jsonplaceholder.typicode.com/posts')
    .subscribe((res: Response) => {
      this.loading = false;
        this.names = res.json();
    });

    this.PlaceProvider.getCurrentAddress().then((data:any) => {
        this.title = data;
    }).catch((err) => {
        //debugger
    })

  }




  //get();
  //
  //  get (): {
  //  return this.http.get('http://shoes.mikero.ru.ru/api/brand.filter')
  //                  .map(this.extractData)
  //                  .catch(this.handleError);
  //}
}


