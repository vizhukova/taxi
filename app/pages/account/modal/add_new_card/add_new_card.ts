import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
// // import {FormsModule} from '@angular/forms';
// import MaskedInput from 'angular2-text-mask'
import {  Card } from './../../../../providers/cards/cards';

@Component({
    templateUrl: 'build/pages/account/modal/add_new_card/add_new_card.html',
})
export class AddNewCardModal {


    cardName: string = "Master Gold";
    isShownSelect: boolean = false;
    cards: Array<string>;
    card: Object = {};
    mask: Array<any> = [/[0-9]/,/[0-9]/, '/', /[0-9]/,/[0-9]/];

    numInArray: string;

    name: string;
    num: string;
    owner: string;
    date: string;
    cvc: string;

    error: Object = {};

    isEdit: boolean = false; //открыто для создания или редактирования

    constructor(private nav: NavController, private CardProvider: Card) {

        this.cards = ['Master Card', 'Master GOLD', 'VISA'];

        CardProvider.card$.subscribe(card => {

            if (Object.keys(card).length) {
                this.card = card;

                this.numInArray = Object.keys(card)[0];

                this.cardName = card[this.numInArray].type;
                this.name = card[this.numInArray].name;
                this.num = card[this.numInArray].num;
                this.owner = card[this.numInArray].owner;
                this.date = card[this.numInArray].date;
                this.cvc = card[this.numInArray].cvc;
                this.isEdit = true;

            } else {
                this.cardName = this.cards[0];
            }

        });

    }

    showSelect(e, value) {
        this.isShownSelect = value;
        if (value) {
            e.stopPropagation();
        }
    }

    setCard(value) {
        this.cardName = value;
    }

    closeModal() {

        this.CardProvider.clearCard();
        this.nav.pop({animate: false});
    }

    isError(key) {
        if (!this[key] || !this[key].trim().length || (key == 'num' && this.num.length < 16)) {
            this.error[key] = true;
            return true;
        } else {
            if (this.error[key]) delete this.error[key];
            return false;
        }
    }

    submit() {
        if (Object.keys(this.error).length) {
            return;
        }

        if (this.num.length < 16) {
            this.error['num'] = true;
            return;
        }

        var newCard = {
            name: this.name,
            num: this.num,
            owner: this.owner,
            date: this.date,
            cvc: this.cvc,
            isMain: this.card['isMain'] || false,
            type: this.cardName
        };

        if (this.isEdit) {
            this.CardProvider.changeCardInArray(this.numInArray, newCard);
        } else {
            this.CardProvider.addCard(newCard);
        }

        this.closeModal();
    }

}