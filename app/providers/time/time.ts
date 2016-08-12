import {Geolocation} from 'ionic-native';
import {Injectable, Output, EventEmitter} from '@angular/core';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {Http, Response} from '@angular/http';
import {Time} from "../../interfaces/time";

@Injectable()
export class TimeProvider {

    time: Time;

    // Observable data sources
    private timeSource = new BehaviorSubject<Time>(null);

    // Observable data streams
    time$ = this.timeSource.asObservable();

     constructor() {
        this.time = {
            string: new Date().toISOString(),
            key: 'now',
            value: ''
        }
    }
    // Service message commands
    public change(time:Time) {
        this.time = time;
        this.timeSource.next(time);
    }

    public get() {
        return this.time;
    }

}
