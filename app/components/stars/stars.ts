import { Component, Input, EventEmitter } from '@angular/core';
import {  NavController } from 'ionic-angular';


@Component({
    templateUrl: 'build/components/stars/stars.html',
    selector: 'stars-mark',
    outputs: ['onchangeMark']
})
export class Stars {

    @Input('mark') mark: number;
    // @Input('onchangeMark') onchangeMark: any;
    public onchangeMark = new EventEmitter();

    constructor(private nav: NavController) {

    }

    getClass(num: number) {
        return this.mark >= num ? 'star-fill' : 'star-empty';
    }

    setMark(e) {
        var num = parseInt( e.target.dataset['num'] );
        debugger
        if(num) {
            // this.mark = num;
            this.onchangeMark.emit(num)
        }
    }

}