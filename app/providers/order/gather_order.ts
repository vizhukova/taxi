import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { OrderModel } from './../../models/order';
import {Auth} from "../auth/auth";
import {Place} from "../place/place";
import {CarOptions} from "../car-options/car-options";
import {Source} from "../../interfaces/order";
import {Destination} from "../../interfaces/order";
import {Order} from "../../interfaces/order";
import {TimeProvider} from "../../providers/time/time";
import {URL} from './../../config';


@Injectable()
export class GatherOrder {

    currentOrderId: string;
    apiId: string;
    lastDate: string;
    status: string;

    data:any;

    destinations:Array<Destination>;//type KnopkaGeoPoint[]
    source:Source;//type KnopkaGeoPoint
    urgent:boolean = false;
    vehicleClass: string;
    recipientBlackListed: string;
    recipientLoyal : string;
    recipientPhone : string;
    requirements : Array<string>;

    clientMark: number;//оценка пользователя


    order: Order;


    constructor(private http:Http,
                private AuthProvider: Auth,
                private PlaceProvider: Place,
                private CarOptionsProvider: CarOptions,
                private TimeProvider: TimeProvider) {

    }

    public setDestination(data: Destination) {
        this.destinations = [data];
    }
    public setSource(point: Source) {
        this.source = point;
    }
    public setUrgent(point: boolean) {
        this.urgent = point;
    }
    public setRequirements(data: Array<string>) {
        this.requirements = data;
    }
    public setPhone(data: string) {
        this.recipientPhone = data;
    }

    public setVehicleClass(data: string) {
        this.vehicleClass = data;
    }

    public setRecipientBlackListed(data: string) {
        this.recipientBlackListed = data;
    }
    public setRecipientLoyal(data: string) {
        this.recipientLoyal = data;
    }

    public get() {
        return this;
    }

    public getGatheredOrder() {
        return this.order;
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
            this.source = <Source>item;
        }else if(type === 'destination') {
            this.destinations = [item];
        }

    }

    public createOrder(){

        let user = this.AuthProvider.getUser();
        let source = this.PlaceProvider.getFullAddress('from');
        let destination = this.PlaceProvider.getFullAddress('to');
        let requirements = this.CarOptionsProvider.getRequirements();
        let carClass = this.CarOptionsProvider.getCarClass();
        let time = this.TimeProvider.get();
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
        this.apiId = user.id;
        this.order = {
            bookingDate : time.string,
            bookmins : 20,
            booktype : "exact",
            destinations: [destination],
            recipientBlackListed : "no",
            recipientLoyal : "yes",
            recipientPhone : user.phone,
            requirements : requirements,
            source: source,
            urgent: this.urgent,
            vehicleClass: carClass
        };

        let body = {
            apiId: user.id,
            order: this.order
        };

        console.log(JSON.stringify(body));

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Create?taxi=taxity`, body)
                .subscribe((res:Response) => {

                    let data = res.json();
                    this.currentOrderId = data.orderId;

                    this.order.bookingObj = time;

                    resolve(data);

                }, (err) => {

                    reject(err);

                })
        });

    }

    public cancelOrder(){

        //let user = this.AuthProvider.getUser();

        let body = {
            orderId: this.currentOrderId,
            apiId: this.apiId,
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
            apiId: user.apiId/*,
            lastDate: this.lastDate*/
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Status`, body)
                .subscribe((res:Response) => {

                    let data = res.json();
                    this.currentOrderId = data.orderId;
                    resolve({order: this.order, response: data});

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

