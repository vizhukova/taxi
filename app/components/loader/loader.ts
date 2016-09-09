import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {GatherOrder} from "../../providers/order/gather_order";
import {OrderHistory} from "../../providers/order/history";
import {Nav} from "../../providers/nav/nav";
import {Car} from "../../providers/car/car";

@Component({
    templateUrl: 'build/components/loader/loader.html',
})
export class Loader {

    intervalId: number;

    constructor(
        public nav: NavController,
        public GatherOrderProvider: GatherOrder,
        public OrderHistoryProvider: OrderHistory,
        public Navigator: Nav,
        public Car: Car
    ) {
        var self = this;
        
        this.GatherOrderProvider.getOrderStatus().then((data: any) => {
            console.log('Order status: ', data.response.status);
            
            self.Car.subscribe();

            switch(data.response.status) {
                case 'driving':
                case 'assigned':
                     self.Navigator.changeTabSet('order', 'map-car');
                     break;
            }

            this.OrderHistoryProvider.save(data['order']);
            self.close();
        })
    }


    onPageWillEnter() {

        window.addEventListener('resize', this.onResize.bind(this));

        this.changeLoaderPositions();

    }

    onPageDidLeave() {
        window.removeEventListener('resize', this.onResize.bind(this))
    }

    onResize(){
        this.changeLoaderPositions();
    }

    changeLoaderPositions() {
        //get length and width of page
        let clientWidth = (<HTMLScriptElement><any>document.getElementsByTagName('body'))[0].clientWidth;
        let clientHeight = (<HTMLScriptElement><any>document.getElementsByTagName('body'))[0].clientHeight;

        //get first and second circles in loading page
        let elementFist = <HTMLScriptElement><any>document.getElementById('first');
        let elementSecond = <HTMLScriptElement><any>document.getElementById('second');

        //change circles`s position
        if(500 > clientWidth)(elementFist).style.left = `calc((${clientWidth}px - 500px)/2)`;
        else (elementFist).style.left = `0px`;
        if(500 > clientHeight)(elementFist).style.top = `calc((${clientHeight}px - 500px)/2)`;
        else (elementFist).style.top = `0px`;
        if(350 > clientWidth)(elementSecond).style.left = `calc((${clientWidth}px - 350px)/2)`;
        else (elementSecond).style.left = `0px`;
        if(350 > clientHeight)(elementSecond).style.top = `calc((${clientHeight}px - 350px)/2)`;
        else (elementSecond).style.top = `0px`;
    }

    calcelOrder() {
        this.GatherOrderProvider.cancelOrder();
        this.close();
    }

    close() {
        clearInterval(this.intervalId);
        this.nav.pop({animate: false});
    }

}