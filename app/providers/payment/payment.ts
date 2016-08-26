import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ride } from './../../models/ride';
import {Subject, BehaviorSubject, Observable} from 'rxjs'
import {Payment} from "./../../interfaces/payment";

@Injectable()
export class DriverProvider {

     payments: Array<Payment> = [];


    constructor() {

    }

     public get() {
         return this.payments;
     }

}
