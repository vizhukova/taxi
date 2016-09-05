import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {DatePicker} from 'ionic-native';
import { Address } from './../../components/address_panel';

import {CarOptions} from './../../providers/car-options/car-options';
import {TimeProvider} from './../../providers/time/time';
import * as moment from 'moment';
import 'moment/locale/ru';
declare var device: any;

//var platform = device.platform;

//import {moment} from 'moment';
/*
 Generated class for the TimePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */




@Component({
    selector: 'time-page',
    templateUrl: 'build/pages/time/time.html',
    directives: [Address]
})


export class TimePage {

    //time: Array<Object>;
    time:Array<string>;
    repeatTime:string;
    delayTime:string;
    timeInput:string;
    platform: any;
    delayArray: Array<number>;
    isShownInput: boolean;
    delay: number = 20;
    datePickerTime: string;

    minDate: number | string = 0;
    maxDate: number | string = 0;

    constructor(platform: Platform, private nav:NavController, private CarOptionsProvider:CarOptions, private TimeProvider:TimeProvider) {
        this.nav = nav;
        //this.time = [
        //  {name: 'Сейчас', comment: '~5-20 мин'},
        //  {name: 'Через', comment: '20 мин'},
        //  {name: 'Повторять', comment: '10:23'},
        //  {name: 'Другое', comment: 'чт, 7 июля 2016 10:23'}
        //];
        this.platform = platform;
console.log(this.platform)
        moment.locale('ru');

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

    public showTimeModal() {

        DatePicker.show({
          date: new Date(),
          mode: 'time',
          androidTheme: 3,
          minDate: this.minDate || 0,
          is24Hour: true,
          okText: 'Готово',
          cancelText: 'Отмена',
          doneButtonLabel: 'Готово',
          cancelButtonLabel: 'Отмена'
        }).then(
          date => this.onGetTime(date),
          err => console.log("Error occurred while getting date:", err)
        );

    }

    public showDateModal() {

        if( this.platform.is('android') ) {
            this.minDate = Date.parse(moment().toString());
            this.maxDate = Date.parse(moment().add(6, 'd').toString());
            console.log(this.minDate, this.maxDate)
        } else if( this.platform.is('ios') ) {
            this.minDate = moment().toString();
            this.maxDate = moment().add(6, 'd').toString();
        }

        DatePicker.show({
          date: new Date(),
          mode: 'datetime',
          androidTheme: 3,
          minDate: this.minDate || 0,
          maxDate: this.maxDate || 0,
          is24Hour: true,
          okText: 'Готово',
          cancelText: 'Отмена',
          doneButtonLabel: 'Готово',
          cancelButtonLabel: 'Отмена',
            locale: 'ru_ru'
        }).then(
          date => this.onGetDate(date),
          err => console.log("Error occurred while getting date:", err)
        );

    }

    onGetTime(data) {
        this.repeatTime = moment(data).format('HH:mm');
        this.datePickerTime = data;
        this.checkTime(this.time[2]);
    }

    onGetDate(data) {
        this.delayTime = moment(data).format('DD.MM.YYYY HH:mm');
        this.datePickerTime = data;
        this.checkTime(this.time[3]);
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

    // private getTimeString(time:Object) {
    //
    //     let day = time['curr_date'] < 10 ? `0${time['curr_date']}` : time['curr_date'];
    //     let month = time['curr_month'] < 10 ? `0${time['curr_month']}` : time['curr_month'];
    //     let year = time['curr_year'];
    //     let hours = time['curr_hours'] < 10 ? `0${time['curr_hours']}` : time['curr_hours'];
    //     ;
    //     let minutes = time['curr_minutes'] < 10 ? `0${time['curr_minutes']}` : time['curr_minutes'];
    //     ;
    //     let seconds = time['curr_seconds'] < 10 ? `0${time['curr_seconds']}` : time['curr_seconds'];
    //     ;
    //
    //     return `${day}-${month}-${year} ${hours}:${minutes}`;
    // }

    public checkTime(value) {

        let time;
        let subvalue: string = '';

        this.timeInput = value;

        if (value == this.time[0]) {
            time = moment().format('DD-MM-YYYY HH:mm');
        }
        else if (value == this.time[1]) {
            time = moment(moment().add(20, 'm')).format('DD-MM-YYYY HH:mm');

            subvalue = this.delay.toString();
        }
        else if (value == this.time[2]) {
            time = moment(this.datePickerTime).format('DD-MM-YYYY HH:mm');

            subvalue = this.repeatTime;
        }
        else if (value == this.time[3]) {
            time = moment(this.datePickerTime).format('DD-MM-YYYY HH:mm');
            subvalue = this.delayTime;
        }

        this.TimeProvider.change({
            key: value,
            string: time,
            value: subvalue
        });
    }

    // public getMinTime() {
    //     let time = this.getTime(new Date());
    //
    //     let day = time['curr_date'] < 10 ? `0${time['curr_date']}` : time['curr_date'];
    //     let month = time['curr_month'] < 10 ? `0${time['curr_month']}` : time['curr_month'];
    //     let year = time['curr_year'];
    //
    //     return `2016-${month}-${day}`;
    // }

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
