import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class Cost {

    cost:number;


    private costSource = new BehaviorSubject<any>(null);


    cost$ = this.costSource.asObservable();


    constructor(private http:Http) {

    }

    /**
     * Make server connect
     */
    public getCost() {

        let self = this;

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

