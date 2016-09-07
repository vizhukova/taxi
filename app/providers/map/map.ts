import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs';
import { MapState } from '../../interfaces/map'
import { Place } from '../place/place'
import * as _ from 'lodash'
@Injectable()
export class MapProvider {

    state: MapState;
    markers: any;


    private stateSource = new BehaviorSubject<MapState>({
        initial: true,
        searching: false,
        clicked: false,
        direction: 'from',
        error: false,
        onmapsearch: false,
        dragStart: false
    });

    private markersSource = new BehaviorSubject({
        from: {latitude: 0, longitude: 0},
        to: {latitude: 0, longitude: 0}
    });

    state$ = this.stateSource.asObservable();
    markers$ = this.markersSource.asObservable();



    constructor() {

        this.state = this.stateSource.value;
        this.markers = this.markersSource.value

    }

    public set(name, value) {

        this.state[name]= value;

        this.update()
    }

    public setMarker(markers) {
        this.updateMarkers(_.assign(this.markers, markers))
    }
    
    public getState() {
        return this.state;
    }

    public update(){
        this.stateSource.next(this.state);
    }

    public updateMarkers(newValue){
        this.markersSource.next(newValue);
    }

}

