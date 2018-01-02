import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {PeremptionService} from '../../service/peremption.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {	
	constructor(public navCtrl: NavController, private peremptionService: PeremptionService) {
	}

	ngOnInit(){
		this.peremptionService.retrieveData();
	}
}
