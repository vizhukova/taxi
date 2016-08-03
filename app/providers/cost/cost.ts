import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
import {Place} from "../place/place";


@Injectable()
export class Cost {

    cost:number;


    private costSource = new BehaviorSubject<any>(null);


    cost$ = this.costSource.asObservable();


    constructor(private http:Http, private place: Place) {

    }

    /**
     * Make server connect
     */
    public getCost() {

        let self = this;
        
        let coords = this.place.getCurrentCoords();

        setTimeout(() => {
            self.cost = 300;
            self.emitUpdate();
        }, 500)

    }

    public clear() {
        this.cost = null;
        this.emitUpdate();
    }

    private emitUpdate(){
        this.costSource.next(this.cost)
    }

}

