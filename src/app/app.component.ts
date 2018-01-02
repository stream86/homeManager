import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav , App} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export interface PageInterface{
  title: string;
  pageName: string;
  tabComponent: any;
  index: number;
  icon: string;
} 

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage= 'TabsPage';

  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[]=[
  {
     title:"Accueil",pageName: 'TabsPage',tabComponent:'HomePage', index: 0, icon: 'home'
    },
    {
     title:"Dépenses",pageName: 'TabsPage',tabComponent:'CostPage', index: 1, icon: 'costs'
    },
  ]
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page: PageInterface){
  console.log(page.pageName, page.tabComponent,page.index);
    if(page.index){
      this.nav.setRoot(page.pageName,{'tabIndex':page.index});
    }
  }
}
