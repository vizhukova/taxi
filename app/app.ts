import {Component, PLATFORM_DIRECTIVES, PLATFORM_COMMON_PROVIDERS, provide, ViewChild} from '@angular/core';
import {provideRouter, RouterConfig} from '@angular/router';
import {Platform, ionicBootstrap, NavController, NavParams} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {SettingsPage} from './pages/settings/settings';
import {TimePage} from './pages/time/time';
import {AccountPage} from './pages/account/account';
import {Place} from './providers/place/place';
import {RideProvider} from "./providers/ride/ride";
import {Cost} from "./providers/cost/cost";
import {Address} from './components/address_panel'
import {SearchPage} from "./pages/search/search";
import {MainPage} from "./pages/main/main";
import {Nav} from "./providers/nav/nav";
import {RegistrationModal} from "./components/registration/registration";
import {Auth} from "./providers/auth/auth";
import {CarOptions} from "./providers/car-options/car-options";
import {GatherOrder} from "./providers/order/gather_order";
import {AddressProvider} from "./providers/address/address";
import {  OrderHistory } from './providers/order/history';

@Component({
    selector: 'main-tabs',
    template: `
    <ion-tabs>
      <ion-tab tabIcon="locate" [root]="home"></ion-tab>
      <ion-tab tabIcon="options" [root]="settings"></ion-tab>
      <ion-tab tabIcon="clock" [root]="time"></ion-tab>
      <ion-tab tabIcon="person" [root]="account"></ion-tab>
    </ion-tabs>`

})
export class MainTabs {

    home:any = HomePage;
    settings:any = SettingsPage;
    time:any = TimePage;
    account:any = AccountPage;

    change: Function;

    constructor(private nav: NavController, private AuthProvider: Auth, private NavProvider: Nav){

        debugger

    }




}

@Component({
    template: '<ion-nav #myNav [root]="rootPage"></ion-nav>',
    providers: [Place, Cost, Nav, Auth, AddressProvider, CarOptions, GatherOrder, OrderHistory],
    directives: [MainPage, RegistrationModal]
})
export class App {

    @ViewChild('myNav') nav;
    rootPage = RegistrationModal;

    constructor(private platform: Platform, private place: Place, private NavProvider: Nav, private AuthProvider: Auth) {
        this.platform.ready().then(() => {
            StatusBar.styleDefault();
        });

        // let nav = this.app.getComponent('nav');

    }

    

    // showSearchTabs(){
    //     this.nav.push(SearchPage, {
    //         change: this.showMainTabs.bind(this)
    //     })
    // }

    // showMainTabs(){
    //     // this.nav.push(MainTabs)
    // }

}
//
//const routes: RouterConfig = [
//  { path: '', pathMatch: 'full', redirectTo: '/home'},
//  { path: 'home', component: MyApp },
//  { path: 'search', component: SearchPage }
//];

//noinspection TypeScriptValidateTypes
ionicBootstrap(App, [
    // Place,
    RideProvider,
    provide(PLATFORM_DIRECTIVES, {useValue: [Address], multi: true}),
], {
    tabbarPlacement: 'top',
    platforms: {
        ios: {
            tabbarPlacement: 'top'
        }
    }
});
