import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Address } from './../../components/address_panel';

import {Place} from './../../providers/place/place';
import {CarOptions} from './../../providers/car-options/car-options';
import {TimeProvider} from './../../providers/time/time';

//import {moment} from 'moment';
/*
 Generated class for the TimePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'time-page',
    templateUrl: 'build/pages/time/time.html'
})
export class TimePage {

    //time: Array<Object>;
    time:Array<string>;
    repeatTime:string;
    delayTime:string;
    timeInput:string;

    delayArray: Array<number>;
    isShownInput: boolean;
    delay: number = 20;

    constructor(private nav:NavController, private CarOptionsProvider:CarOptions, private TimeProvider:TimeProvider) {
        this.nav = nav;
        //this.time = [
        //  {name: 'Сейчас', comment: '~5-20 мин'},
        //  {name: 'Через', comment: '20 мин'},
        //  {name: 'Повторять', comment: '10:23'},
        //  {name: 'Другое', comment: 'чт, 7 июля 2016 10:23'}
        //];

        this.time = ['now', 'in', 'repeat', 'delay'];
        this.delayArray = [20, 30, 40, 50];

        this.timeInput = this.TimeProvider.get() ? this.TimeProvider.get().key : this.time[0];

        this.TimeProvider.time$.subscribe(req => {

            if (! req) return;

          this.timeInput = req.key;

            if(req.key === this.time[1]) {
                this.delay = parseInt(req.value);
            }
            else if(req.key === this.time[2]) {
                this.repeatTime = req.value;
            }
            else if(req.key === this.time[3]) {
                this.delayTime = req.value;
            }
        });


    }

    public getId(name:string, id:number):string {
        return name + id;
    }

    private getTime(data) {
        return {
            curr_date: data.getDate(),
            curr_month: data.getMonth() + 1,
            curr_year: data.getFullYear(),
            curr_hours: data.getHours(),
            curr_minutes: data.getMinutes(),
            curr_seconds: data.getSeconds()
        }
    }

    private getTimeString(time:Object) {

        let day = time['curr_date'] < 10 ? `0${time['curr_date']}` : time['curr_date'];
        let month = time['curr_month'] < 10 ? `0${time['curr_month']}` : time['curr_month'];
        let year = time['curr_year'];
        let hours = time['curr_hours'] < 10 ? `0${time['curr_hours']}` : time['curr_hours'];
        ;
        let minutes = time['curr_minutes'] < 10 ? `0${time['curr_minutes']}` : time['curr_minutes'];
        ;
        let seconds = time['curr_seconds'] < 10 ? `0${time['curr_seconds']}` : time['curr_seconds'];
        ;

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    public checkTime(value) {

        let time;
        let subvalue: string = '';

        this.timeInput = value;

        if (value == this.time[0]) {
            //time = moment().format('DD-MM-YYYY HH:mm');
            let timeObj = this.getTime(new Date());
            time = this.getTimeString(timeObj);
        }
        else if (value == this.time[1]) {
            //time = moment(moment().add(20, 'm')).format('DD-MM-YYYY HH:mm');
            let timeObj = this.getTime(new Date( Date.now() + this.delay * 60 * 1000 ));
            time = this.getTimeString(timeObj);

            subvalue = this.delay.toString();
        }
        else if (value == this.time[2]) {
            //time = moment().format('DD-MM-YYYY') + this.repeatTime;
            let timeArr = this.repeatTime.split(':');
            let date = new Date();
            date.setHours(parseInt(timeArr[0]));
            date.setMinutes(parseInt(timeArr[1]));
            let timeObj = this.getTime(date);
            time = this.getTimeString(timeObj);

            subvalue = this.repeatTime;
        }
        else if (value == this.time[3]) {
            time = this.delayTime;
            subvalue = this.delayTime;
        }

        this.TimeProvider.change({
            key: value,
            string: time,
            value: subvalue
        });
    }

    public getMinTime() {
        let time = this.getTime(new Date());

        let day = time['curr_date'] < 10 ? `0${time['curr_date']}` : time['curr_date'];
        let month = time['curr_month'] < 10 ? `0${time['curr_month']}` : time['curr_month'];
        let year = time['curr_year'];

        return `2016-${month}-${day}`;
    }

    showSelect(value: boolean, $event: any) {
        this.isShownInput = value === this.isShownInput ? !value : value;
        $event.stopPropagation();
    }

    hideSelect() {
        this.isShownInput = false;
    }

    setDelay(delay: number) {
        this.delay = delay;
    }

}
