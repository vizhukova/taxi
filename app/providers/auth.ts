import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Ride} from './../models/ride';
import {URL} from './../config';

@Injectable()
export class Auth {

    http:any;
    apiId:string;

    constructor(http:Http) {
        this.http = http;
    }

    public register(name:string, number:string) {

        let body = {
            name: name,
            phone: number,
            taxi: 'taxity',
            confirm: true
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Register/Register`, body)
                .subscribe((res:Response) => {

                    var data = res.json();
                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });
    }

    public confirm(key:string, number:string) {

        let body = {
            key: key,
            phone: number
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Register/Confirm`, body)
                .subscribe((res:Response) => {

                    var data = res.json();
                    this.apiId = data.apiId;
                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });
    }

}
