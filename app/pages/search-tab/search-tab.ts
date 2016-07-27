import { Component } from '@angular/core';
import { Address } from './../../components/address_panel';
import { Map } from './../../components/map';

@Component({
  templateUrl: 'build/pages/search-tab/search-tab.html',
  directives: [Address, Map]
})
export class SearchTabPage {

  constructor() {
  }
}
