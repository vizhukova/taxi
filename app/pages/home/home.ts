import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Map } from './../../components/map';
import { Place } from './../../providers/place/place';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  names: string[];
  loading: boolean;
  private PlaceProvider: Place;

  constructor(private navController: NavController, private http: Http) {
    this.http = http;
    this.names = ['Ari1', 'Ari2', 'Ari3', 'Ari4', 'Ari5'];
    this.makeRequest();
    this.PlaceProvider.get();
  }



  makeRequest(): void {
    this.loading = true;
    this.http.request('http://jsonplaceholder.typicode.com/posts')
    .subscribe((res: Response) => {
      this.loading = false;
        this.names = res.json();
    });
  }




  //get();
  //
  //  get (): {
  //  return this.http.get('http://shoes.mikero.ru.ru/api/brand.filter')
  //                  .map(this.extractData)
  //                  .catch(this.handleError);
  //}
}


