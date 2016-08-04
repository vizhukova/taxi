import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { OrderModel } from './../../models/order';
import {Auth} from "../auth/auth";


@Injectable()
export class GatherOrder {

    currentOrderId: string;
    apiId: string;
    lastDate: string;
    status: string;

    data:any;
    destinations:Array<Object>;//type KnopkaGeoPoint[]
    source:Object;//type KnopkaGeoPoint
    urgent:boolean = false;
    requirements:Array<string>;
    phone:string;


    constructor(private http:Http, private AuthProvider: Auth) {
        
    }

    public setDestination(data: Object) {
        this.destinations = [data];
    }
    public setSource(point: Object) {
        this.destinations = [point];
    }
    public setUrgent(point: Object) {
        this.destinations = [point];
    }
    public setRequirements(data: Array<string>) {
        this.requirements = data;
    }
    public setPhone(data: string) {
        this.phone = data;
    }

    public get() {
        return this;
    }

    public setAddress(type: string, address: any){

        let item = {
            city : address.city,
            closestStation : '',
            country : address.country,
            description : '',
            entrance : '',
            fullAddress : address.fullAddress,
            housing : address.housing,
            index : 1,
            kind : 'street',
            lat : address.geoPoint.lat,
            lon : address.geoPoint.lon,
            shortAddress : address.shortAddress
        };

        if(type === 'source') {
            this.source = item;
        }else if(type === 'destination') {
            this.destinations = [item];
        }

    }

    public createOrder(){

        let user = this.AuthProvider.getUser();

        /**
         * TODO Собрать заказ в нужном формате
         * @type {{}}
         * {
            "apiId" : "14d0e38a-3126-4822-adba-c4b922efe821",
            "order" :
            {
                "bookingDate" : "27-05-2016 09:15",
                "bookmins" : 20,
                "booktype" : "exact",
                "destinations" : [
                    {
                        "city" : "Севастополь",
                        "closestStation" : "",
                        "country" : "Россия",
                        "fullAddress" : "Севастополь, аллея Астапова",
                        "index" : 1,
                        "kind" : "street",
                        "lat" : 44.562354,
                        "lon" : 33.455128,
                        "shortAddress" : "аллея Астапова",
                        "street" : "аллея Астапова"

                     }
                ],
                "recipientBlackListed" : "no",
                "recipientLoyal" : "yes",
                "recipientPhone" : "+79055337245",
                "requirements" : ["simple_bagage", "pay_parking"],
                "source" :
                {
                    "city" : "Севастополь",
                    "closestStation" : "",
                    "country" : "Россия",
                    "description" : "sfd",
                    "entrance" : "sdf",
                    "fullAddress" : "Севастополь, dsf, п. sdf",
                    "housing" : "dsf",
                    "index" : 0,
                    "kind" : "district",
                    "lat" : 44.565212,
                    "lon" : 33.46417,
                    "shortAddress" : "dsf, п. sdf"
                },
                "urgent" : false,
                "vehicleClass" : "Com"
            }
         }
         */
        let body = {};


        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Create`, body)
                .subscribe((res:Response) => {

                    let data = res.json();
                    this.currentOrderId = data.orderId;
                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });

    }

    public cancelOrder(){

        let user = this.AuthProvider.getUser();

        let body = {
            orderId: this.currentOrderId,
            apiId: user.apiId,
            reason: ''
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Cancel`, body)
                .subscribe((res:Response) => {

                    let data = res.json();
                    this.currentOrderId = data.orderId;
                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });

    }

    public getOrderStatus(){

        let user = this.AuthProvider.getUser();

        let body = {
            orderId: this.currentOrderId,
            apiId: user.apiId,
            lastDate: this.lastDate
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Status`, body)
                .subscribe((res:Response) => {

                    let data = res.json();
                    this.currentOrderId = data.orderId;
                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });

    }

    public clear() {
        this.destinations = [];
    }

    private updateLastDate(){

        /**
         * TODO получать текущую дату и время в формате 2016-05-27 13:18:21.0
         * @type {string}
         */
        let date = '';

        this.lastDate = date;

    }
}

