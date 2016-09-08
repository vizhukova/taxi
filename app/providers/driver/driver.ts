import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../../models/ride';
import {Subject, BehaviorSubject, Observable} from 'rxjs'
import {Driver} from "./../../interfaces/driver";
import {Comment} from "./../../interfaces/driver";

@Injectable()
export class DriverProvider {

     driver: Driver;
     driverComment: Comment;


    constructor() {

    }

     public getDriver() {
         return this.driver;
     }

     public getDriverComment() {
         return this.driverComment;
     }

}
