import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
import {StatsService} from '../../service/stats.service';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {

	@ViewChild('canvas')canvasEl: ElementRef;
	@ViewChild(Content) content: Content;

	constructor(public navCtrl: NavController, private statsService: StatsService) {
  	}

  	ngOnInit(){
  		this.statsService.initCanvas(this.canvasEl.nativeElement)
  		this.statsService.retrieveData();
  	}

  	changeMod(mode){
  		this.content.scrollTo(0,200);
  		this.statsService.mode=mode;
  		if(this.statsService.mode=="edition"){
  			this.statsService.fillForm();
  		}
  	}
}
