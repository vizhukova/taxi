import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {  AddNewCardModal } from './../add_new_card/add_new_card';

import {  Card } from './../../../../providers/cards/cards';

@Component({
    templateUrl: 'build/pages/account/modal/cards/cards.html'
})
export class CardsModal {

    cards: Array<Object> = [];
    visibleMenu: string;

    constructor(private nav: NavController, public CardProvider: Card) {

        CardProvider.cards$.subscribe(cards => {
          this.cards = cards;
        });
    }

    getKeys(object) {
        return Object.keys(object);
    }

    showMenu(e, key: string) {

        if( this.visibleMenu === key) {
            this.hideMenu(e);
            return;
        }

        e.stopPropagation();
        this.visibleMenu = key;
    }

    makeMain(num: string) {
       this.cards.map( (item) => {item['isMain'] = false} );
        this.cards[num].isMain = true;
    }

    editOption(num: string) {
        this.CardProvider.editCard(num);
        this.nav.push(AddNewCardModal);
    }

    deleteOption(num: string) {
        this.CardProvider.removeCard(num);
    }

    createNew() {
        this.nav.push(AddNewCardModal);
    }

    hideMenu(e) {
        this.visibleMenu = "";
        e.stopPropagation();
    }

    closeModal() {
        this.nav.pop();
    }

    getNum(num) {
        return `xxxx xxxx xxxx ${num[12]}${num[13]}${num[14]}${num[15]}`;
    }

}