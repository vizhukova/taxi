import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
import {Place} from "../place/place";
import {MapProvider} from "../map/map";
import {PathCoordinates} from "../../interfaces/coordinates";
import {URL} from './../../config';


@Injectable()
export class Cost {

    cost:any;


    private costSource = new BehaviorSubject<any>(null);


    cost$ = this.costSource.asObservable();


    constructor(private http:Http, private place: Place, private MapProvider:MapProvider) {

        place.coords$.subscribe((newCoords)=>{
            this.getCost(newCoords)
        })

    }

    /**
     * Make server connect
     */
    public getCost(coords:PathCoordinates) {

        if(!coords.from.latitude) return;


        let self = this;

        self.clear();
        
        let body = {
            "adds" : ["simple_bagage", "pay_parking"],
            "bookingTime" : "20",
            "class" : "Com",
            "destinations" : [
                {
                    "kind" : "street",
                    "lat" : coords.from.latitude,
                    "lon" : coords.from.longitude

                }
            ],
            "source" :
            {
                "kind" : "district",
                "lat" : coords.to.latitude ? coords.to.latitude : coords.from.latitude,
                "lon" : coords.to.longitude ? coords.to.longitude : coords.from.longitude
            },
            "taxi" : "taxity"
        };

        return new Promise((resolve, reject) => {
            this.http.post(`${URL}/Order/Cost`, body)
                .subscribe((res:Response) => {

                    var data = res.json();
                    self.cost = coords.to.longitude === 0? Math.ceil(data.min) : Math.ceil(data.sum);
                    self.emitUpdate();
                    resolve(data);
                }, (err) => {
                    self.MapProvider.set('error', true);
                    self.cost = "---";
                    self.emitUpdate();

                    reject(err);

                })
        });

    }

    public clear() {
        this.cost = null;
        // this.emitUpdate();
    }

    private emitUpdate(){
        this.costSource.next(this.cost)
    }

}

