import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Ride} from './../../models/ride';
import {URL} from './../../config';

@Injectable()
export class Auth {

    http:any;
    user:Object;

    constructor(http:Http) {
        this.http = http;

        this.user = {
            id: null,
            name: null
        }

    }

    public register(name:string, number:string) {

        let body = {
            name: name,
            phone: number,
            taxi: 'taxity',
            confirm: true
        };

        this.user['name'] = name;

        localStorage.setItem('user', JSON.stringify(this.user));

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Register/Register`, JSON.stringify(body))
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

        let self = this;

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Register/Confirm`, JSON.stringify(body))
                .subscribe((res:Response) => {

                    var data = res.json();

                    self.user['id'] = data.apiId;

                    localStorage.setItem('user', JSON.stringify(this.user));

                    resolve();

                }, (err) => {

                    reject(err);

                })
        });
    }

    public check(): boolean {
        let data = localStorage.getItem('user');
        if(data){
            var user = JSON.parse(data)
        }else{
            return false
        }
        return !!user.id
    }

}
