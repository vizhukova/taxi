import { Component } from '@angular/core';
import { Address } from './../../components/address_panel';

@Component({
  templateUrl: 'build/pages/search-tab/search-tab.html',
  directives: [Address]
})
export class SearchTabPage {

  constructor() {
  }
}
