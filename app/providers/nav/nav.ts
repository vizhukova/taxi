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

    private tabChangeSource = new Subject<any>(null);

    tabChange$ = this.tabChangeSource.asObservable();

    constructor(private http:Http) {


    }

    showTabs(vc) {

        this.tabChangeSource.next(vc)

    }

}

