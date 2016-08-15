import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
import { MapState } from '../../interfaces/map'
import { Place } from '../place/place'

@Injectable()
export class MapProvider {

    state: MapState;

    private stateSource = new BehaviorSubject<MapState>({
        initial: true,
        searching: false,
        clicked: false,
        direction: 'from',
        error: false
    });

    state$ = this.stateSource.asObservable();


    constructor() {

        this.state = this.stateSource.value

    }

    public set(name, value) {

        this.state[name]= value;

        this.update()
    }
    
    public getState() {
        return this.state;
    }

    public update(){

        this.stateSource.next(this.state);
        console.log('new mapprovider', this.state)
    }

}

