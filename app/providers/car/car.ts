import {Injectable} from '@angular/core';
// import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
// import {Place} from "../place/place";
// import {MapProvider} from "../map/map";
import {GatherOrder} from "../order/gather_order";


@Injectable()
export class Car {

    interval: any;

    // Observable data sources
    private driverSource = new BehaviorSubject<any>({});

    // Observable data streams
    driver$ = this.driverSource.asObservable();


    constructor(
        private GatherOrder:GatherOrder
    ) {
                
    }
    
    subscribe() {
        var self = this;
        if(this.interval) clearInterval(this.interval);
        this.interval = setInterval(()=>{
            self.GatherOrder.getOrderStatus().then((res:any)=>{
                self.setDriver(res.response)
            })
        }, 7000)
    }
    
    setDriver(car) {
        this.driverSource.next(car)
    }
    
    get() {
        
    }
    
}

