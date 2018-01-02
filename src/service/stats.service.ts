import { Injectable,ErrorHandler } from '@angular/core';
import { Http } from'@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StatsService{

	canvas: any;
	ctx: any;
	products= [{"name":"","previousPrice":0,"currentPrice":0,"minPrice":{"price":0,"date":null},"nutrition":{"calories":0,"glucides":0,"protéines":0,"lipides":0}}];
	productsFiltered=[];
	productsToDisplay=[];
	currentProduct={"name":"","previousPrice":0,"currentPrice":0,"minPrice":{"price":0,"date":null},"nutrition":{"calories":0,"glucides":0,"protéines":0,"lipides":0}};
	form={"name":"","price":0,"calories":0,"glucides":0,"protéines":0,"lipides":0};
	mode="ajout";

	constructor(private http: Http){
	}

	initCanvas(canvas){
		this.canvas=canvas;
		this.ctx=canvas.getContext("2d");
	}

	setView(product){
		this.getProductsToDisplay(product);
		if(typeof(product)=="string"){
			this.setCurrentProduct(this.productsFiltered[0]);
			this.productsFiltered.shift();

		}else{
			this.setCurrentProduct(product);
			//this.removeFrom(object,key)?;
		}
		this.displayData(this.currentProduct);
	}

	getProductsToDisplay(productFilter){
		var products="";
		this.productsFiltered=[];
		this.productsToDisplay=[];
		var filter="";
		if(typeof(productFilter)=="object"){
			filter=productFilter.name.charAt(0).toLowerCase();
		}else{
			filter=productFilter.toLowerCase();
		}
		for(let product of this.products){
			if(product.name.charAt(0)==filter){
				if(typeof(productFilter)=="string" || typeof(productFilter)=="object" && product.name!=productFilter.name){
					products+=product.name+" ";
					this.productsFiltered.push(product);
				}
			}
		}
		console.log(products +" filtrés");
	}

	displayData(product){
		this.drawGraph(product);
		this.resetMod();
	}

	updateProductData(product){
		for(let key in this.products){
			if(this.products[key].name==this.currentProduct.name){
				this.products.splice(Number(key),1,product);
			}
		}
	}

	hydrateData(){
		var data={"name":this.form.name.toLowerCase(),"previousPrice":this.currentProduct.currentPrice,"currentPrice":this.form.price,"minPrice":{"price":this.currentProduct.minPrice.price,"date":this.currentProduct.minPrice.date},"nutrition":{"calories":this.form.calories,"glucides":this.form.glucides,"protéines":this.form['protéines'],"lipides":this.form.lipides}};
		if(this.form.price<this.currentProduct.currentPrice){
			data.minPrice.price=this.form.price;
			data.minPrice.date=new Date();
		}
		return data;
	}

	getProductStatus(product){
		return (product.currentPrice>product.previousPrice)?"grow":(product.currentPrice<product.previousPrice)?"low":"steady";
	}

	setCurrentProduct(product){
		this.currentProduct=product;
	}

	setProducts(data){
		this.products=data;
	}

	retrieveData(){
		var _this=this;
		this.http.get("http://foodManager-api.esy.es/stats.php").toPromise().then(function(response){
			_this.setProducts(response.json());
			_this.setView(_this.products[0]);
		});
	}

	postData(product){
		var _this=this;
		this.http.post("http://foodManager-api.esy.es/stats.php",this.products).toPromise().then(function(response){
			_this.products.forEach(function(value,key){
				console.log(key,value);
			});
			_this.setView(product);
		});
	}

	insertProduct(product){
		for(let i=0;i<this.products.length;i++){
			if(product.name<this.products[i].name){
				return this.products.splice(i,0,product);
			}
		}
	}

	addProduct(){
		if(this.form.name!=""){
			var product={"name":this.form.name.toLowerCase(),"previousPrice":this.form.price,"currentPrice":this.form.price,"minPrice":{"price":this.form.price,"date":new Date()},"nutrition":{"calories":0,"glucides":0,"protéines":0,"lipides":0}};
			this.insertProduct(product);
		}
		this.postData(product);
	}

	updateProduct(){
		var product=this.hydrateData();
		this.updateProductData(product);
		this.postData(product);
	}

	drawGraph(product){
		var zoom=40;
		var max=140;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();
		this.ctx.lineWidth="5";
		this.ctx.strokeStyle="red";
		this.ctx.shadowBlur=2;
		this.ctx.shadowColor="black";
		this.ctx.moveTo(10,product.minPrice.price/140*100*zoom);
		this.ctx.lineTo(150,product.previousPrice/140*100*zoom);
		this.ctx.lineTo(280,product.currentPrice/140*100*zoom);
		this.ctx.stroke();
		this.ctx.closePath();
		/*textes*/
		this.ctx.font = "20px Georgia";
		this.ctx.fillText(product.minPrice.price,10,product.minPrice.price/140*100*zoom+20);
		this.ctx.fillText(product.previousPrice,150,product.previousPrice/140*100*zoom+20);
		this.ctx.fillText(product.currentPrice,270,product.currentPrice/140*100*zoom+20);
		/*pastilles*/
		this.ctx.beginPath();
		this.ctx.strokeStyle="red";
		this.ctx.arc(10,product.minPrice.price/140*100*zoom,2,0,2*Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.strokeStyle="orange";
		this.ctx.arc(150,product.previousPrice/140*100*zoom,2,0,2*Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.strokeStyle="yellow";
		this.ctx.arc(280,product.currentPrice/140*100*zoom,2,0,2*Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	fillForm(){
		this.form.name=this.currentProduct.name;
		this.form.price=this.currentProduct.currentPrice;
		this.form.calories=this.currentProduct.nutrition.calories;
		this.form['protéines']=this.currentProduct.nutrition['protéines'];
		this.form.glucides=this.currentProduct.nutrition.glucides;
		this.form.lipides=this.currentProduct.nutrition.lipides;
	}

	resetMod(){
		this.mode="ajout";
		this.form.name="";
		this.form.price=0;
		this.form.calories=0;
		this.form['protéines']=0;
		this.form.glucides=0;
		this.form.lipides=0;
	}

	doInfinite(infiniteScroll) {
    	console.log('Begin async operation');

		setTimeout(() => {
			var end=this.productsToDisplay.length+2;
  			for (let i = this.productsToDisplay.length; i <end; i++) {
  				if(this.productsFiltered[i]!=undefined){
  					this.productsToDisplay.push( this.productsFiltered[i] );
  				}else{
  					//infiniteScroll.enable(false);
  				}
				
			}

			console.log('Async operation has ended');
			infiniteScroll.complete();
      		
		}, 500);
    }

}
