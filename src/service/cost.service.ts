import { Injectable,ErrorHandler } from '@angular/core';
import { Http } from'@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CostService{

	monthCosts=[];
	currentMonth= 'janvier';
	currentYear='2017';
	max=0;
	amount=0;

	constructor(private http: Http){}

	getIndex(){
		for(var i=0;i<this.monthCosts.length;i++){
			if(this.monthCosts[i].mois==this.getMonth()){
				return i;
			}
		}
	}
	getAmount(){
		return this.monthCosts[this.currentYear][this.currentMonth].amount;
	}
	getTotal(){
		return this.monthCosts[this.currentYear][this.currentMonth].costs;
	}	
	setTotal(){
		this.monthCosts[this.currentYear][this.currentMonth].costs+=this.amount*1;
	}
	getMonth(){
		return this.currentMonth;
	}
	setMonth(month){
		this.currentMonth=month;
	}
	setMonthCosts(monthCosts){
		this.monthCosts=monthCosts;
	}
	updateData(){
		this.setTotal();
		this.http.post("http://foodManager-api.esy.es/depenses.php",{donnees:this.monthCosts}).toPromise().then(
			()=>console.log('mise à jour des données serveur !')
		).catch(this.error);
		//draw (si on veut modifier le dom ici par la suite)
	}
	retrieveData(){
		var _this=this;
		var months=["janvier","fevrier","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","decembre"];
		var curMonth=months[new Date().getMonth()];
		return this.http.get("http://foodManager-api.esy.es/depenses.php").toPromise().then(function(response){
			var data=response.json();
			_this.setMonth(curMonth);
			_this.setMonthCosts(data);
			_this.maxCost();
			return _this.monthCosts;
		}).catch(this.error);
	}
	maxCost(){
		var max=0;
		for(var key in this.monthCosts[this.currentYear]){
			if(this.monthCosts[this.currentYear][key].costs>max){
				max=this.monthCosts[this.currentYear][key].costs;
			}
		}
		this.max=max;
		console.log("Dépenses mensuelles max : "+max);
	}	
	error(){
		console.log('erreur !');
	}
}