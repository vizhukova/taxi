import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
import {Place} from "../place/place";
import {URL} from './../../config';


@Injectable()
export class Cost {

    cost:any;


    private costSource = new BehaviorSubject<any>(null);


    cost$ = this.costSource.asObservable();


    constructor(private http:Http, private place: Place) {

    }

    /**
     * Make server connect
     */
    public getCost() {

        let self = this;

        self.clear();
        
        let coords = this.place.getCurrentCoords();

        let body = {
            "adds" : ["simple_bagage", "pay_parking"],
            "bookingTime" : "20",
            "class" : "Com",
            "destinations" : [
                {
                    "kind" : "street",
                    "lat" : coords.to.latitude,
                    "lon" : coords.to.longitude

                }
            ],
            "source" :
            {
                "kind" : "district",
                "lat" : coords.from.latitude,
                "lon" : coords.from.longitude
            },
            "taxi" : "taxity"
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Cost`, body)
                .subscribe((res:Response) => {

                    var data = res.json();
                    self.cost = Math.ceil(data.sum);
                    self.emitUpdate();
                    resolve(data);

                }, (err) => {

                    self.cost = "---";
                    self.emitUpdate();

                    reject(err);

                })
        });

    }

    public clear() {
        this.cost = null;
        this.emitUpdate();
    }

    private emitUpdate(){
        this.costSource.next(this.cost)
    }

}

