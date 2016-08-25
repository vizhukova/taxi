import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';


@Component({
    templateUrl: 'build/pages/like/modal/modal.html'
})
export class LikesModal {


    constructor(private nav: NavController) {

    }

    public closeModal() {
        this.nav.pop();
    }

    public canselCloseModal(event) {
        event.stopPropagation();
    }

}