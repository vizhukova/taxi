import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  template: `
    <div class="application">
    </div>
`,
  directives: [ROUTER_DIRECTIVES]
})
export class IndexPage {


  constructor() {
  }
}
