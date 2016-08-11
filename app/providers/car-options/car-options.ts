import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {URL} from './../../config';
import {BehaviorSubject} from "rxjs/Rx";


@Injectable()
export class CarOptions {
  options: any = [];
  requirements: any = [];
  carClasses: any = [];

  requirementsInput: Array<string>;
  carClassInput: string;
  timeInput: string;


  //requirementsInput: any = [];
  //carClassInput: string;

  private requirementsInputSource = new BehaviorSubject<Array<any>>([]);
  private carClassInputSource = new BehaviorSubject<string>('');
  private requirementsSource = new BehaviorSubject<any>(null);
  private carClassesSource = new BehaviorSubject<any>(null);
  private timeSource = new BehaviorSubject<any>(null);

  requirements$ = this.requirementsSource.asObservable();
  carClasses$ = this.carClassesSource.asObservable();
  requirementsInput$ = this.requirementsInputSource.asObservable();
  carClassInput$ = this.carClassInputSource.asObservable();
  timeInput$ = this.timeSource.asObservable();



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

  public changerRequirements(value: Array<string>) {
    this.requirementsInput = value;
    this.requirementsInputSource.next(value);
  }

  public changerCarClass(value: string) {
    this.carClassInput = value;
    this.carClassInputSource.next(value);
  }

  public changerTime(value: any) {
    this.timeInput = value;
    this.timeSource.next(value);
  }

  public getRequirements() {
    return this.requirementsInput;
  }

  public getCarClass() {
    return this.carClassInput;
  }

  public getTime() {
    return this.timeInput;
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

