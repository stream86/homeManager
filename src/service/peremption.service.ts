import { Injectable,ErrorHandler } from '@angular/core';
import { Http } from'@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PeremptionService{

	foodData= [{"name":"","type":"","date": null}];
	foodTypes=["viande","poisson","legume","fruit","laitage","cereales"];
	field={"name":"","type":"viande","date":new Date().toISOString()};
	
	constructor(private http: Http){}

	setfoodData(data){
		this.foodData=data;
	}
	retrieveData(){
		var _this=this;
		this.http.get("http://foodManager-api.esy.es/peremption.php").toPromise().then(function(response){
			_this.setfoodData(response.json());
		});
	}
	updateData(){
		var _this=this;
		var data=this.foodData;
		if(this.field.name!=""){
			data.push({"name": this.field.name,"type":this.field.type,"date":this.field.date});
		}
		this.http.post("http://foodManager-api.esy.es/peremption.php",data).toPromise().then(function(response){
			_this.setfoodData(response.json());
			_this.field.name="";
			_this.foodData.forEach(function(value,key){
				console.log(key,value);
			});
		});
	}
	deleteProduct(productDate){
		if(confirm("Supprimer ce produit ?")){
			var index=0;
			this.foodData.forEach(function(value,key){
				if(productDate==value.date){
					index=key;
					console.log(value.date,key);
				}
			});
			console.log(this.foodData.splice(index,1));
			this.updateData();
		}
	}
	getNbJours(date){
		return Math.ceil((new Date(date).getTime()-new Date().getTime())/(1000*3600*24));
	}
	getProductStatus(date){
		return (this.getNbJours(date)<0)?"black":(this.getNbJours(date)<3)?"red":(this.getNbJours(date)<6)?"orange":"green";
	}
}