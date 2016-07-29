import { Component } from '@angular/core';
import { Map } from './../../components/map';
import {NavController} from "ionic-angular/index";

@Component({
  selector: 'search-tab-page',
  templateUrl: 'build/pages/search-tab/search-tab.html',
  directives: [Map]
})
export class SearchTabPage {

  constructor(private nav: NavController) {
  }
}
