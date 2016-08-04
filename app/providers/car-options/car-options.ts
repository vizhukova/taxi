import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {URL} from './../../config';
import {BehaviorSubject} from "rxjs/Rx";


@Injectable()
export class CarOptions {
  options: any;
  requirements: any;
  carClasses: any;


  private requirementsSource = new BehaviorSubject<any>(null);
  private carClassesSource = new BehaviorSubject<any>(null);

  requirements$ = this.requirementsSource.asObservable();
  carClasses$ = this.carClassesSource.asObservable();


  constructor(private http: Http) {
    this.options = null;
  }

  load() {

    return new Promise(resolve => {

      this.http.get(`${URL}/Order/CarOptions`)
        .map(res => res.json())
        .subscribe(data => {

          this.options = data;

          this.requirements = CarOptions.parseRequirements(data);
          this.carClasses = CarOptions.parseCarClasses(data);

          this.emitUpdate();

          resolve(this.options);
        });
    });
  }

  /**
   * TODO Сделать поиск по локали
   * @param data
   * @returns {{name: any, value: (number|string)}[]}
     */
  private static parseRequirements(data){

    let source = data.requirements;

    return source.map((element => {

      return {
        name: element.name[0].value,
        value: element.code
      };

    }))

  }

  private static parseCarClasses(data){

    let source = data.carClasses;

    return source.map((element => {

      return {
        name: element.name[0].value,
        value: element.value
      };

    }))

  }

  private emitUpdate(){
    this.requirementsSource.next(this.requirements);
    this.carClassesSource.next(this.carClasses);
  }


}

