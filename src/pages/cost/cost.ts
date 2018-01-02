import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
import {CostService} from '../../service/cost.service';

@IonicPage()
@Component({
  selector: 'page-cost',
  templateUrl: 'cost.html'
})

export class CostPage{

	data: any[];

	@ViewChild(Content) content: Content;

	constructor(public navCtrl: NavController, private costService: CostService) {
	}

	ngOnInit(){
		this.costService.retrieveData().then(data=>{this.data=data[this.costService.currentYear];console.log(this.data)});
	}

	getData(){
		this.costService.retrieveData().then(data=>{this.data=data[this.costService.currentYear];console.log("Données de :"+this.costService.currentYear)});
	}

	scrollToBottom(){
		this.content.scrollToBottom();
	}
}
