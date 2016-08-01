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
import {Nav} from "./providers/nav/nav";
import {RegistrationModal} from "./components/registration/registration";
import {Auth} from "./providers/auth/auth";

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

    constructor(private nav: NavController, private AuthProvider: Auth){

    }


    ngAfterViewInit(){
        if(!this.AuthProvider.check()){
            this.nav.push(RegistrationModal);
        }
    }

}

@Component({
    selector: 'blank',
    template: '<div class="app"></div>',
})
class Blank{

}

@Component({
    template: '<ion-nav #myNav [root]="rootPage"></ion-nav>',
    providers: [Place, Cost, Nav, Auth],
    directives: [Blank]
})
export class App {

    @ViewChild('myNav') nav;
    rootPage = Blank;

    constructor(private platform: Platform, private place: Place, private NavProvider: Nav, private AuthProvider: Auth) {
        this.platform.ready().then(() => {
            StatusBar.styleDefault();
        });
        
        let self = this;

        NavProvider.tabChange$.subscribe((vc) => {
            self.nav.pop()
            self.nav.pop()
            self.nav.push(vc)
        });

        // let nav = this.app.getComponent('nav');

    }

    ngAfterViewInit() {

        let self = this;
        // Let's navigate from TabsPage to Page1
        this.nav.push(MainTabs);



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
