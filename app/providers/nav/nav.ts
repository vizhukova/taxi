import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {NavController} from "ionic-angular/index";
import {Subject} from "rxjs/Rx";

/*
 Generated class for the Nav provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Nav {

    tab: string;
    tabSet: string;

    private tabSource = new Subject<any>(null);
    private tabSetSource = new Subject<any>(null);

    tab$ = this.tabSource.asObservable();
    tabSet$ = this.tabSetSource.asObservable();

    constructor() {

        this.tab = 'home';
        this.tabSet = 'main';

    }

    public changeTab(tab): void {
        this.tab = tab;
        this.tabSource.next(tab);
    }

    public changeTabSet(tabSet): void {
        this.tab = 'home';
        this.tabSet = tabSet;
        this.tabSetSource.next(tabSet);
        this.tabSource.next(this.tab);
    }

    public getCurrentTab(): string {
        return this.tab;
    }

    public getCurrentTabSet(): string {
        return this.tabSet;
    }

}

