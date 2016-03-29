/*
 basket status:
    new
    confirm
    confirmed
    rejected
 */

angular.module("firebase",[])
.service("$firebaseObject",[function()
    {
	
    }]);


angular.module("ngIndex",["ngResource","ngCommunity","ui.router","ngUpload","ionic-img-lazy-load"])
.constant("url","")
.value("config",
	{
	shop:"main"
	})
.config(["$stateProvider",function($stateProvider)
   {
   $stateProvider
   .state('index',
		{
		abstract:true,		
		template: '<ui-view/>'		
		})   		
	.state('index.pricing',
		{
		abstract:true,		
		template: '<ui-view/>'		
		})   		
	.state('index.pricing.list', 
		{
	    url: "/index/pricing.html",	    
	    templateUrl: "views/index/pricing.html",	
	    controller:"indexPricingController"
	    })
	    
	.state('index.group',
		{
		abstract:true,		
		template: '<ui-view/>'		
		})   		
	.state('index.group.list', 
		{
	    url: "/index/group/list.html",	    
	    templateUrl: "views/index/groups.html",	
	    controller:"indexGroupsController"
	    })	 
	    
	.state('index.catalogue',
		{
		abstract:true,		
		template: '<ui-view/>'		
		})   		
	.state('index.catalogue.list', 
		{
	    url: "/index/catalogue/list.html",	    
	    templateUrl: "views/index/catalogues.html",	
	    controller:"indexCataloguesController"
	    })	 
	    
	.state('index.list',
   		{
   		url:'/index/list/{group}',
   		templateUrl: 'views/index/list.html',
   		controller:'indexController'
   		})   
   	.state('index.item', 
		{
		url: "/index/item/{id}",	    
		templateUrl: "views/index/single/base.html",	
		controller:"indexSingleController"
		})
	.state('index.item.base', 
		{
		url: "/base",	    
		templateUrl: "views/index/single/base.html",	
		controller:"indexSingleEditController"
		})
		
	.state('index.edit', 
		{
		abstract:true,		
		template: '<ui-view/>'
		})
	.state('index.edit.item', 
		{
		abstract:true,		
		template: '<ui-view/>'
		})
	.state('index.edit.item.base', 
		{
		url: "/index/edit/item/base/{id}",	    
		templateUrl: "views/index/single/base.html",	
		controller:"indexSingleEditController"
		})
	.state('index.edit.item.art', 
		{
		url: "/index/edit/item/art/{id}",	    
		templateUrl: "views/index/single/art.html",	
		controller:"indexArtSingleEditController"
		})
		
	.state('basket',
		{
		url:"/views/basket",
		templateUrl: "views/basket/base.html",	
		controller:"basketController"
		})
	.state('checkout', 
		{
		url:"/basket/checkout",
		templateUrl: "views/basket/checkout.html",	
		controller:"basketController"
		})
	.state('checkout.billing', 
		{
		url:"/billing",
		templateUrl: "views/basket/billing.html",	
		controller:"basketController"
		})
	 .state('checkout.shipping',
		{
		url:"/shipping",
		templateUrl: "views/basket/shipping.html",	
		controller:"basketController"
		})
	 .state('checkout.shippingType',
		{
		url:"/shippingtype",
		templateUrl: "views/basket/shippingType.html",	
		controller:"basketController"
		})
	.state('checkout.payment',
		{
		url:"/payment",
		templateUrl: "views/basket/payment.html",	
		controller:"basketController"
		})
	.state('checkout.resume',
		{
		url:"/resume",
		templateUrl: "views/basket/resume.html",	
		controller:"basketController"
		})
	.state('checkout.confirm',
		{
		url:"/confirm",
		templateUrl: "views/basket/confirm.html",	
		controller:"basketController"
		})
	.state('warehouse', {
	    url: "/warehouse",	    
	    templateUrl: "views/orders/warehouse.html",
	    controller:"warehouseController"
	    })
	.state('order', {
	    url: "/order/{id}",	    
	    templateUrl: "views/orders/single.html",
	    controller:"orderController"
	    })	
	.state('orders', {
	    url: "/orders",	  	    
	    templateUrl: "views/orders/list.html",
	    controller:"ordersController"
	    })
	
    	//'<div ng-include="type"/>'
   }])
.factory("wish",["$resource",function($resource)		
   {
	var act = 
		{		
		inside:function(obj)
			{
			for(var i in this.list)
				if(this.list[i].id==obj.id)
					return true;
			return false;
			},
		toggle:function(obj)
			{			
			if(this.inside(obj)) 	this.remove(obj);
			else					this.add(obj);
			},
		remove:function(obj)
			{
			obj.inWish=false;
			for(var i in this.list)
				if(this.list[i].id==obj.id)
					return this.list.splice(i,1);			
			},
		add:function(obj)
			{			
			if(this.inside(obj)) return;
			obj.inWish=true;		
			this.list.push(obj);
			},
		list:[]   
	   	};	
	return act;
   }])
.factory("indexItems",["$resource","config",function($resource,config)		
   {
   return $resource(config.index.url.item,{id:"@id",shop:config.shop},
		{
	   	category:
	   		{
	   		isArray:true,
	   		method:"get",
	   		url:"http://localhost:8080/index/:shop/items/:group"
	   		}
		});	
   }])
.factory("catalogues",["$resource","config",function($resource,config)		
   {
   return $resource("http://localhost:8080/index/catalogue/:id",{id:"@id",shop:config.shop});	
   }])
.factory("groups",["$resource","config",function($resource,config)		
   {
   return $resource(config.index.url.group,{id:"@id",shop:config.shop});	
   }])
.factory("pricing",["$resource","config",function($resource,config)		
   {
   return $resource("http://localhost:8080/index/pricing/:id",{id:"@id",shop:config.shop});	
   }])
.controller("indexPricingController",["$scope","pricing","config",function($scope,pricing,config)
   {
   pricing.query(function(data)
		{
	   	$scope.list=data;
	   	})   
	$scope.add=function(name)
		{
	    var obj = {name:name,description:"",pass:"",shop:config.shop}
	   	pricing.save(obj,function()
	   		{
	   		$scope.list.push(obj);
	   		});
		}   
   $scope.remove=function(item)
		{			
		pricing.remove({id:item.name},function()
			{
			var i= $scope.list.indexOf(item)
			$scope.list.splice(i,1);
			});
		}
   }])
.controller("indexGroupsController",["groups","$scope","$state","config",function(groups,$scope,$state,config)
    {	
	$scope.remove=function(item)
		{			
		groups.remove({id:item.name},function()
			{
			var i= $scope.groups.indexOf(item)
			$scope.groups.splice(i,1);
			});
		}
	$scope.nuovo=function()
		{					
		var obj = {name:$scope.name,shop:config.shop};				
		groups.save(obj,function()
			{
			$scope.groups.push(obj);
			});
		}		
		
	groups.query(function(data)
		{			
		
		$scope.groups=data;			
		});	
    }])
.controller("indexCataloguesController",["catalogues","$scope","$state","config",function(catalogues,$scope,$state,config)
    {	
	$scope.remove=function(item)
		{			
		catalogues.remove({id:item.name},function()
			{
			var i= $scope.groups.indexOf(item)
			$scope.groups.splice(i,1);
			});
		}
	$scope.nuovo=function()
		{					
		var obj = {name:$scope.name,shop:config.shop};				
		catalogues.save(obj,function()
			{
			$scope.groups.push(obj);
			});
		}		
			
	catalogues.query(function(data)
		{					
		$scope.groups=data;			
		});	
    }])
.controller("indexNewController",["indexItems","$scope","$state","wish","basket","groups",function(items,$scope,$state,wish,basket,groups)
    {		
	items.category({group:"new"},function(data)
		{
		for(var i in data)
			{
			data[i].discount = (data[i].basePrice/data[i].price)-1;
			
			data[i]["new"]=false;
			try{data[i]["new"] = data[i].categories.indexOf("new")>=0;}catch(e){} 
			data[i].single=function()
				{
				$state.go("singleItem",{id:this.id})				
				}
			}
		
		$scope.basket=basket;
		$scope.list=data;
		});
    }])
.controller("indexController",["indexItems","$scope","$state","wish","basket","groups","catalogues",function(items,$scope,$state,wish,basket,groups,catalogues)
    {	
	$scope.price=0;
	$scope.filter="";
	$scope.wish=wish;
	$scope.basket=basket;	
	$scope.group=null;
	$scope.change=function(index)
		{						
		$scope.title=$scope.groups[index].name.toUpperCase();			
		};

	items.query(function(data)
		{
		$scope.list=data;
		var gr={}
		for(var i in data)
			{
			data[i].discount = (data[i].basePrice/data[i].price)-1;
			
			data[i]["new"]=false;
			try{data[i]["new"] = data[i].categories.indexOf("new")>=0;}catch(e){};
			data[i].single=function()
				{
				$state.go("singleItem",{id:this.id});			
				}			
			
			angular.forEach(data[i].categories,function(name)
				{
				if(gr[name]==null) gr[name]=0;
				gr[name]++;
				});		
			}
		
		catalogues.query(function(data)
			{	
			$scope.catalogues=data;			
			try{$scope.title=data[0].name.toUpperCase();}catch(e){}
			
			angular.forEach(data,function(item)
				{
				if($state.params.group==item.id)
					$scope.catalogue=item;
				item.size=gr[item.name];
				if(item.size==null) item.size=0;
				});
			});		
		
		groups.query(function(data)
			{	
			$scope.groups=data;			
			try{$scope.title=data[0].name.toUpperCase();}catch(e){}
			
			angular.forEach(data,function(item)
				{
				if($state.params.group==item.id)
					$scope.group=item;
				item.size=gr[item.name];
				if(item.size==null) item.size=0;
				});
			});		
		})	
    }])
.controller("indexSingleController",["$stateParams","indexItems","$scope","groups","pricing","catalogues",function($stateParams,items,$scope,groups,pricing,catalogues)
    {	
	
	items.get({id:$stateParams.id},function(data)
			{
			$scope.item=data;					
			});
		
		catalogues.query(function(data)
			{						
			$scope.catalogues=data;					
			});
	
		groups.query(function(data)
			{						
			$scope.groups=data;
			console.log(data)
			$scope.title=data[0].name;
			});
		
		pricing.query(function(data)
			{								
			$scope.pricing=data;
			});
    }])
.controller("indexSingleEditController",["$sce","$stateParams","indexItems","$scope","$state","groups","pricing","config",
                                 function($sce,$stateParams,items,$scope,$state,groups,pricing,config)
    {			
	$scope.save=function()
		{
		debugger;
		var obj = 
			{
			"name":this.item.name,
			"id":this.item.id,
			"visible":this.item.visible,
			"code":this.item.code,
			"description":$sce.parseAsHtml(this.item.description),
			"prices":{},	
			"categories":[],
		 	"gallery":[],
			"extra":this.item.extra,
			"shop":config.shop
		 	}
		obj.gallery=this.item.gallery;
		angular.forEach($scope.item.groups,function(value,key)
			{			
			if(value.checked)
				obj.categories.push(value.id);
			})
		angular.forEach($scope.item.pricing,function(value,key)
			{						
			obj.prices[value.id]=value.value;
			})
		items.save(obj,function()
			{			
			$state.go("index.list")
			});
		}
	
	items.get({id:$stateParams.id},function(data)
		{
		$scope.item=data;			
		if(data.gallery==null) data.gallery=[];
		groups.query(function(groups)
			{											
			angular.forEach(groups,function(cat)
				{				
				try{cat.checked=data.categories.indexOf(cat.name)>=0;}catch(e){cat.checked=false;}											
				})
			data.groups=groups;
			});
		pricing.query(function(pricings)
			{					
			angular.forEach(pricings,function(pricing)
				{
				try{pricing.value = data.prices[pricing.id];}catch(e){}
				})
			data.pricing=pricings;			
			});
		});
			
    }])
 .controller("wishController",["wish","basket","$scope",function(wish,basket,$scope)
    {			 
	$scope.filter="";
	$scope.wish=wish;
	$scope.basket=basket;
	$scope.list=wish.list;
    }])
    
    
.factory("order",["$resource","config","user",function($resource,config,user)
	{
	var def = {
			id:"@id",
			shop:config.shop,			
			}
	if(!config.order.anyUser) 
		def.user=user.mail
	return $resource(config.basket.url.item,def);	
	}]) 
.controller("basketStatusController",["$scope","order","$modal","basket",function($scope,order,$modal,db)
    {
	$scope.rowOutBox=function(row,basket)
		{		
		row.status="inBox";
		if(row.object==null) row.data={};
		if(row.object.inbox==null) row.object.inbox=0;
		row.object.inbox--;
		
		return db.save(basket);		
		}
	$scope.rowInBox=function(row,basket)
		{		
		row.status="inBox";
		if(row.object==null) row.data={};
		if(row.object.inbox==null) row.object.inbox=0;
		row.object.inbox++;
		
		if(row.object.inbox<row.qta) return db.save(basket);
		
		row.status="complete";
		
		var complete=true;
		angular.forEach(basket.rows,function(row)
			{
			if(row.status!="complete") complete=false; 
			})
		if(complete) basket.status="complete";
		db.save(basket);
		}
	$scope.confirm=function(basket)
		{				
		basket.status="confirm";		
		db.save(basket);
		}
	$scope.confirmed=function(basket)
		{				
		basket.status="confirmed";
		db.save(basket);
		}
	$scope.removed=function(basket)
		{				
		basket.status="removed";
		db.save(basket);
		}
	$scope.rejected=function(basket)
		{				
		var modalInstance = $modal.open(
	           {templateUrl: "myModalContent.html",
	        	controller:function($scope,$modalInstance)
	        		{
	        		$scope.text		=	"";
	        		$scope.close	=	function()		{$modalInstance.close(this.text);}
	        		}
	           }).result.then(function (text) 
	           {
	            	basket.status="rejected";
	            	if(basket.data==null) basket.data={};
	            	basket.data.message=text;
	        		db.save(basket);
	           });
		}	
    }])
.controller("ordersController",["$scope","order","$modal","basket",function($scope,order,$modal,db){
	$scope.page="ordersController"
	order.query(function(data){
		$scope.orders=data;
		})
	}])
.controller("orderController",["$scope","order","$stateParams",function($scope,order,$stateParams){	
	order.get({id:$stateParams.id},function(data){
		$scope.basket=data;
		})
	}])
.controller("shippingController",["$scope","basket","$ionicSideMenuDelegate",function($scope,basket,$ionicSideMenuDelegate)
   {
	$scope.basket=basket;
	
	$scope.setShipping=function(value)
		{		
		basket.shipping.name=value.name
		basket.shipping.address=value.address;
		$scope.shippingModal.hide();		
		$ionicSideMenuDelegate.toggleRight();
		}
   }]) 
.factory("basket",["config","$resource","$q","user","$filter",function(config,$resource,$q,user,$filter)
   {
   var basket = $resource("http://localhost:8080/basket/:id",{id:"@id",shop:config.shop});
   var act = 
	   {	   
	   name:"Massimiliano Regis",
	   status:"new",
	   shop:config.name,
	   clear:function()
	   	  {
		   var act =this;		   
		   angular.forEach(this.rows,function(row)
				{
				row.obj.row=null;
				row.obj.inBasket=false;
				row.qta=0;
				});
		   this.rows=[];
		   this.calc();		   
	   	   },
	   shipping:
	   	   {		  
		   price:12,
		   gratisLevel:100,
		   basePrice:12,
		   
		   first_name:"first",
		   last_name:"last",
		   name:"Passo in negozio",		   
		   email:"max@max.it",
		   address:"",
		   addressLine1:"linea 1",
		   addressLine2:"linea 2",
		   country:"country",
		   city:"city",
		   state:"Teramo",
		   zip:"zip",		   
		   phone:"phone",
		   info:""
	   	   },	   
	   payment:
	   	   {
		   likeShipping:true,
		   first_name:null,
		   last_name:null,
		   name:null,		   
		   email:null,
		   address:null,
		   addressLine1:null,
		   addressLine2:null,
		   country:null,
		   city:null,
		   state:null,
		   zip:null,		   
		   phone:null,
		   info:null
	   	   },
	   find:function(obj)
	   	   {
		   for(var i in act.rows)
			   if(act.rows[i].obj==obj) return act.rows[i];
		   return null;
	   	   },
	   inside:function(obj)
		   {
		   for(var i in act.rows)
			   if(act.rows[i].obj==obj) return true;
		   return false;
		   },
	   remove:function(row)
	   	   {		   
		   row.obj.row=null;
		   row.obj.inBasket=false;
		   row.qta=0;
		   act.rows.splice(act.rows.indexOf(row),1);	
		   this.calc();
	   	   },
	   calc:function()
	   	   {
		   var total=0;		   
		   for(var i in this.rows)		   
		   		total+=this.rows[i].total;
		   
		   this.total=total;
		   
		   if(this.total>=this.shipping.gratisLevel) this.shipping.price=0;
		   else										this.shipping.price=this.shipping.basePrice;
		   
		   this.totalWithTax=total+this.shipping.price;
		   },
	   total:0,
	   totalWithTax:0,
	   sub:function(obj)
	   	   {
		   if(obj.row!=null) 	obj.row.qta--;
		   if(obj.row.qta>0) return;
			   
		   this.remove(obj.row);
		   obj.row==null;
	   	   },
	   sum:function(obj)
	   	   {
		   if(obj.row!=null) 	obj.row.qta++;
		   else 				this.add(obj);
	   	   },
	   add:function(obj)
	   	   {
		   var act = this;		
		   var actObj=null;
		   angular.forEach(this.rows,function(row)
				{
			    if(row.obj.id==obj.id) actObj=row;
				})
		   if(actObj!=null) 
			   {
			   actObj.sum();
			   this.calc();
			   return;
			   }
		   var row = 
		   		{
				basket:act,
				sum:function(){this.qta++; this.calc();},
				sub:function(){this.qta--; this.calc();},
				calc:function()
					{
					this.price=this.obj.price;
					this.total=this.obj.price*this.qta;
					this.basket.calc();
					},
				obj:obj,
				qta:1,
				price:obj.price,
				total:obj.price
		   		}
		   obj.inBasket=true;
		   obj.row=row;		   
		   act.rows.push(row);
		   console.log(this);
		   //this.total+=parseFloat(row.price);
		   this.calc();
	   	   },
	   	paypal:
	   		{
	   		email:"massimiliano.regis@gmail.com",
	   		pay:function()
	   		{				
			var shipping=act.shipping;				
			var payment=act.payment;						
			var paypal =
				{
				lc					 :"IT",
				cmd					 :"_cart",
				business			 :act.paypal.email,
				redirect_cmd		 :"_cart",
				upload				 :"1",	
							
				first_name			 :shipping.first_name,
				last_name			 :shipping.last_name,
				address1			 :shipping.addressLine1,	
				address2			 :shipping.addressLine2,			
				email				 :shipping.email,
				buyer_email			 :shipping.email,
				city				 :shipping.city,
				country				 :shipping.country,
				state				 :shipping.state,
				zip					 :shipping.zip,
				
				billing_first_name	 :payment.first_name,
				billing_last_name	 :payment.last_name,
				billing_address1	 :payment.addressLine1,	
				billing_address2	 :payment.addressLine2,
				billing_city		 :payment.city,
				billing_country		 :payment.country,
				billing_state		 :payment.state,
				billing_zip			 :payment.zip,
				
				night_phone_a		:shipping.phone,
				night_phone_b		:shipping.phone,
				night_phone_c		:shipping.phone,			
				shipping_1	 		:shipping.price,							
				invoice		 		:act._session,
				same_as_billing		:true,
				currency_code		:"EUR",
				amount		 		:act.total,
				image_url	 		:act._paypalimage!=null?act._paypalimage:"",
				//custom				:macumba.ID()+"|"+macumba.persistence,
				//notify_url	 		:macumba.domain("[domain]/services_v[version]/basket/paid.jsp"),
				"return"	 		:document.location.href+"#basket.OK",
				cancel_return:document.location.href
				};
				
				angular.forEach(act.rows,function(row, pos)
					{			
					pos+=1;				
					paypal["item_name_"+pos]=row.obj.name;
					paypal["item_number_"+pos]=row.obj.code;
					paypal["amount_"+pos]=row.total;
					paypal["quantity_"+pos]=row.qta;
					})	
						
				console.log(paypal);				
				var realurl	= "https://www.paypal.com/cgi-bin/webscr";
				var testurl = "https://www.sandbox.paypal.com/cgi-bin/webscr";
				var url = act.test?testurl:realurl;
				var form = $("<FORM ACTION='"+url+"' METHOD='post'/>");
				for(var key in paypal)
					{
					var value = paypal[key];
					var inp = $("<INPUT TYPE='hidden' NAME='"+key+"' VALUE='"+value+"'/>");
					if(value!=null) form.append(inp);
					};		
				
			
				form.submit();
				return true;
				}
	   		},
	   rows:[],
	   data:{},	   
	   shop:config.shop,
	   save:function(obj)
	   	{
		if(obj==null) obj=this;
		var deferred = $q.defer();
		debugger;
		basket.save(obj,function(id){deferred.resolve(id.id);});
		return deferred.promise;
	   	},
	   toJSON:function()
	   		{
		    var result={
		    	id:this.id,
		    	name:this.name,
		    	shop:this.shop,
		    	date:new Date(),
		    	data:this.data,
		    	status:this.status,
		    	shipping:this.shipping,
		    	user:user.mail,
		    	//total:this.total,
		    	rows:[]
		    	}
		    angular.forEach(this.rows,function(row)
		    	{
		    	result.rows.push({
		    		id:Math.random(),
		    		code:row.obj.code,
		    		price:row.price,
		    		name:row.obj.name,
		    		img:row.obj.gallery[0].img,
		    		qta:row.qta
		    		})
		    	})
		    return result;
	   		}
	   }
   act.calc();
   return act;
   }])
 .controller("basketController",["basket","$scope",function(basket,$scope)
    {		
	$scope.basket=basket;	
    }])
.controller("warehouseController",["$scope","order",
                                   function($scope,order)
    {		
	$scope.confirmed=function(basket)
		{				
		basket.status="confirmed";
		baskets.save(basket);
		}
	$scope.removed=function(basket)
		{				
		basket.status="removed";
		baskets.save(basket);
		}
	
	order.query(function(data){
		console.log(data);
		$scope.items=[];
		angular.forEach(data,function(item)
			{
			angular.forEach(item.rows,function(row)
				{
				for(var i=0;i<row.qta;i++)
					$scope.items.push(angular.extend({},row,{qta:0}));				
				});			
			})
			
		var obj={}
		angular.forEach($scope.items,function(item)
			{
			if(obj[item.code]==null)	obj[item.code]=item;
			obj[item.code].qta++;
			});
		$scope.items=obj;
		})
		
    }])
.service("round",[function()
   {
   this.round=function(val, multiplesOf) {
	  var s = 1 / multiplesOf;
	  var res = Math.ceil(val*s)/s;
	  res = res < val ? res + multiplesOf: res;
	  var afterZero = multiplesOf.toString().split(".")[1];
	  return parseFloat(res.toFixed(afterZero ? afterZero.length : 0));
		}
   }])
.filter("minPrice",function()
	{
	return function(items,search)
		{								
		if(items==null) return[];
		return items.filter(function(item, index, array) 
			{									
			if(search==null || search=="") return true;
		    return item.price>=search;
	    	})		
		}
	}) 
.filter("maxPrice",function()
	{
	return function(items,search)
		{								
		if(items==null) return[];
		return items.filter(function(item, index, array) 
			{									
			if(search==null || search=="") return true;
		    return item.price<=search;
	    	})		
		}
	}) 
.filter("inGroup",function()
	{
	return function(items,search)
		{								
		if(items==null) return[];
		return items.filter(function(item, index, array) 
			{									
			if(search==null || search=="") return true;
		    return $.inArray(search,item.categories)>=0;
	    	})		
		}
	})
.filter('percentage', ['$window','round', function ($window,round) {
        return function (input, decimals,arr, suffix) {
        	if(arr==null) arr=1;
            decimals = angular.isNumber(decimals)? decimals :  3;
            suffix = suffix || '%';
            if ($window.isNaN(input)) {
                return '';
            }            
            //return Math.round(input * Math.pow(10, decimals + 2))/Math.pow(10, decimals) + suffix
            return (round.round(input,arr).toFixed(decimals)*100) + suffix;
        };
    }])
    
    
 