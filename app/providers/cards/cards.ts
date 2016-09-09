import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {BehaviorSubject} from 'rxjs';
import {URL} from './../../config';


@Injectable()
export class Card {

    cards: Array<Object> = [];
    card:Object = {};

    private cardSource = new BehaviorSubject< Object >({});
    private cardsSource = new BehaviorSubject< Array<Object> >([]);

    cards$ = this.cardsSource.asObservable();
    card$ = this.cardSource.asObservable();


    constructor(private http:Http) {
        this.cards = [
            {name: "Яндекс Деньги", num: "1234567891236693", type: "Master Card", isMain: true},
            {name: "Кредитка Сбера", num: "1234567891236693", type: "Master GOLD", isMain: false},
            {name: "QIWI", num: "1234567891236693", type: "VISA", isMain: false}
        ];
        this.cardsSource.next(this.cards);
    }

    editCard(index:string) {

        var obj = {};
        obj[index] = this.cards[index];

        this.card = obj;
        this.cardSource.next(this.card);

    }

    clearCard() {
        this.card = {};
        this.cardSource.next(this.card);
    }

    changeCardInArray(index, item) {
        this.cards[index] = item;
        this.cardsSource.next(this.cards);
    }

    addCard(value) {
        this.cards.push(value);
        this.cardsSource.next(this.cards);
    }

    removeCard(key) {
        this.cards = this.cards.filter((item, index) => index != key);
        this.cardsSource.next(this.cards);
    }


}

