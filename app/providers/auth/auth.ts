import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Ride} from './../../models/ride';
import {URL} from './../../config';
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class Auth {

    http:any;
    user:any;

    private userSource = new BehaviorSubject<any>({});

    // Observable data streams
    user$ = this.userSource.asObservable();

    constructor(http:Http) {
        this.http = http;

        this.user = {
            id: null,
            name: null,
            phone: null
        };
        
        let user = localStorage.getItem('user');

        if(user) {
            this.user = JSON.parse(user);
            this.emitUpdate();
        }

    }

    public register(name:string, number:string) {
        var self = this;

        let body = {
            name: name,
            phone: number,
            taxi: 'taxity',
            confirm: true
        };

        this.user['name'] = name;
        this.user['phone'] = number;

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
            phone: number,
            taxi: 'taxity'
        };


        let self = this;

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Register/Confirm`, JSON.stringify(body))
                .subscribe((res:Response) => {

                    var data = res.json();

                    self.user['id'] = data.apiId;

                    this.emitUpdate();

                    localStorage.setItem('user', JSON.stringify(self.user));
                    resolve(data.result);

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

    public getUser(){
        return this.user;
    }

    private emitUpdate(){
        this.userSource.next(this.user)
    }

}
