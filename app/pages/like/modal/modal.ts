import { Component, NgZone } from '@angular/core';
import {  NavController } from 'ionic-angular';


@Component({
    templateUrl: 'build/pages/like/modal/modal.html'
})
export class LikesModal {

    mark: number = 0;

    constructor(private nav: NavController, private zone:NgZone) {

    }

    public closeModal() {
        this.nav.pop({animate: false});
    }

    public canselCloseModal(event) {
        event.stopPropagation();
    }

    public onchangeMark(num) {
        this.mark = num;
        console.log('onchangeMark', this.mark)
    }

     getStarClass(num: number) {
        return this.mark >= num ? 'star-fill' : 'star-empty';
    }

    setMark(e) {
        var num = parseInt( e.target.dataset['num'] );
        if(num) {
            this.mark = num;
        }
    }

}