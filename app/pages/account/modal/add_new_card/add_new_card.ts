import { Component, NgModule } from '@angular/core';
import {  NavController } from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import MaskedInput from 'angular2-text-mask'
import { Card } from './../../../../providers/cards/cards';


@Component({
    templateUrl: 'build/pages/account/modal/add_new_card/add_new_card.html',
    directives: [MaskedInput]
})
export class AddNewCardModal {


    cardName: string = "Master Gold";
    isShownSelect: boolean = false;
    cards: Array<string>;
    card: Object = {};
    mask: Array<any> = [/\d/, /\d/, '/', /\d/, /\d/];
    mask_cvc: Array<any> = [/\d/, /\d/, /\d/];
    mask_card: Array<any> = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

    numInArray: string;

    name: string;
    num: string;
    owner: string;
    date: string;
    cvc: string;

    error: Object = {};

    isEdit: boolean = false;
    private textMask = false;
    //открыто для создания или редактирования

    constructor(private nav: NavController, private CardProvider: Card) {

        this.cards = ['Master Card', 'Master GOLD', 'VISA'];

        CardProvider.card$.subscribe(card => {

            if (Object.keys(card).length) {
                this.card = card;

                this.numInArray = Object.keys(card)[0];

                this.cardName = card[this.numInArray].type;
                this.name = card[this.numInArray].name;
                this.num = card[this.numInArray].num + '_';
                this.owner = card[this.numInArray].owner;
                this.date = card[this.numInArray].date + '_';
                this.cvc = card[this.numInArray].cvc + '_';
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


    onAccept(key) {
        this.textMask = true;
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
            num: this.num.slice(0, -1).replace(/\s/g, ''),
            owner: this.owner,
            date: this.date.slice(0, -1),
            cvc: this.cvc.slice(0, -1),
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