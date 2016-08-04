import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/components/loader/loader.html',
})
export class Loader {

    constructor(public nav: NavController) {

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

    close() {
        this.nav.pop();
    }

}