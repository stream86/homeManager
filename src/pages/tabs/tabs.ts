import { Component } from '@angular/core';
import { IonicPage,NavController,NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'CostPage';
  tab3Root = 'StatsPage';

  myIndex: number;

  constructor(public navParams: NavParams, public navController: NavController) {
  	this.myIndex = navParams.data.tabIndex || 0;
  }
}
