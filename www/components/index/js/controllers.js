angular.module("ngIndex.controllers",["ngBase"])
.controller("paintingController",["$scope","$resource",function($scope,$resource){
	var auths = $resource("data/authors.json");
	auths.query(function(data){
		$scope.authors=data;	
	})
	
	$scope.newAuthor=false;
	$scope.nuovo=function()	{
		$scope.newAuthor=true;
	}
	$scope.cerca=function()	{
		$scope.newAuthor=false;
	}
	
}])
.controller("indexPricingController",["$scope","pricing","config",function($scope,pricing,config)
   {
   pricing.query(function(data)
		{
	   	$scope.list=data;
	   	})   
	$scope.add=function(name)
		{
	    var obj = {name:name,description:"",pass:"",shop:config.shop.base}
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
.controller("indexGroupsController",["groups","$scope","$state","config","$stateParams",function(groups,$scope,$state,config,$stateParams)
    {	
	var shop= $stateParams.shop||config.shop.base;
	
	$scope.remove=function(item)
		{			
		groups.remove({id:item.name,shop:shop},function()
			{
			var i= $scope.groups.indexOf(item)
			$scope.groups.splice(i,1);
			});
		}
	$scope.nuovo=function()
		{					
		var obj = {name:$scope.name,shop:shop};				
		groups.save(obj,function()
			{
			$scope.groups.push(obj);
			});
		}	
	groups.query({shop:shop},function(data)
		{		
		$scope.groups=data;			
		});	
    }])
    
.factory("goodType",[function()
     {
	var goodTypes=
	       	    {
				"Good"		:	{name:"Generic",edit:"pub.admin.good.item"},
				"generic"	:	{name:"Generic",edit:"pub.admin.good.item"},
				"picture"	:	{name:"Picture",edit:"pub.admin.good.picture"}
     			};
     var actTypes=[];
	 return {
		setTypes:function(data){			
			actTypes=[];
			angular.forEach(data,function(item){
				actTypes.push(goodTypes[item]);
			})
		},
		query:function(callback)
			{
			callback(actTypes);
			}
	 	}
     }])
.controller("indexController",["$timeout","goodType","$ionicActionSheet","$ionicModal","$stateParams","$ionicHistory","indexItems","$scope","$state","wish","basket","groups","catalogues","$q","popup",
                              function($timeout,goodType,$ionicActionSheet,$ionicModal,$stateParams,$ionicHistory,items,$scope,$state,wish,basket,groups,catalogues,$q,popup)
    {	
	
	
	$scope.$root.cls="indexlist";
	$scope.$root.activeGroup=$stateParams.groupName;	
	$scope.price=0;
	$scope.filter="";	
	$scope.wish=wish;	
	$scope.group=null;
	$scope.removeGroup=function(item)
		{
		popup.confirm("Sicuro?","Vuoi rimuovere '"+item.name+"'",function()
			{			
			item.$delete();
			$scope.groups.splice($scope.groups.indexOf(item),1);
			$scope.$broadcast("objUpdate");
			})
		}
	$scope.removeGood=function(item,list)
		{
		popup.confirm("Sicuro?","Vuoi rimuovere '"+item.name+"'",function()
			{
			item.$delete();
			list.splice(list.indexOf(item),1);						
			})
		}
	$scope.addGood=function()
		{
		goodType.query(function(goodTypes)
			{		
			var newGood = function(index) {$state.go(goodTypes[index].edit);}
			if(goodTypes.length==1) 	  return newGood(0);
			var opt={
			     buttons: [],		     
				 cancelText: 'Cancel',		     
				 buttonClicked: newGood
				 };
			angular.forEach(goodTypes,function(item)
				{
				opt.buttons.push({text:item.name});
				});		
			$ionicActionSheet.show(opt);
			
			})
		}
	
	var shop= $stateParams.shop||config.shop.base;
	var loadGroups = function(shop,gr)	{				
		var promise = groups.query({shop:shop}).$promise;
		promise.then(function(data)
			{				
			$scope.groups=data;			
			try{$scope.title=data[0].name.toUpperCase();}catch(e){}			
			angular.forEach(data,function(item)
				{
				if($state.params.group==item.id)
					$scope.group=item;
				if(gr!=null) 		item.size=gr[item.name];
				if(item.size==null) item.size=0;
				});			
			});
		};
				
		
	var loadItems=function(shop){
		var deferred = $q.defer();
		items.query({shop:shop},function(data)
			{						
			$scope.list=data;
			var gr={}
			angular.forEach(data,function(item)
				{				
				item.discount = (item.basePrice/item.price)-1;							
				
				item["new"]=false;
				try{item["new"] = item.categories.indexOf("new")>=0;}catch(e){};
				item.single=function()
					{
					$state.go("singleItem",{id:this.id});			
					}			
				
				angular.forEach(item.categories,function(name)
					{
					if(gr[name]==null) gr[name]=0;
					gr[name]++;
					});		
				$scope.groupDetail=gr;
				});				
			loadGroups(shop,gr);
			deferred.resolve(data);
			});
		return deferred.promise;
		}
	
	var wishPromise=wish.query({shop:shop});		
	$q.all([
	        wishPromise,
	        loadItems(shop)
	        ]).then(function(data)
	       {	       
	       angular.forEach(data[1],function(item)
	    	    {	    	   
	    	    item.wish=data[0].inside(item);
	    	    })
	       })
	
			/*
		catalogues.query({shop:shop},function(data)
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
			});*/				
		
    }])
.controller("indexSingleController",["wish","$ionicSideMenuDelegate","$ionicModal","config","$stateParams","indexItems","$scope","groups","pricing","$cordovaSocialSharing",
                                     function(wish,$ionicSideMenuDelegate,$ionicModal,config,$stateParams,items,$scope,groups,pricing,$cordovaSocialSharing)
    {		
	var shop= $stateParams.shop||config.shop.base;
	$scope.$root.cls="singleGood";
	$scope.wish=wish;
	$scope.items = [];
	
	
	$scope.item 	= {name:$stateParams.name,discount:null,price:null,base:null};	
	items.get({id:$stateParams.id,shop:shop},function(data)
			{				
			$scope.item=data;
			$scope.item.price 		= data.price;
			$scope.item.base 		= data.basePrice;
			$scope.item.discount 	= null;
			$scope.item.description	= data.description;
			$scope.item.share=function()
				{
				console.log("sharing...");	
				console.log(this.name)
				console.log(this.gallery[0].img)
				
				$cordovaSocialSharing
				    .share(this.name, this.name,this.gallery[0].img ,null)
				    .then(function(result) {
				    	console.log("shared!");
				    }, function(err) {
				      // An error occured. Show a message to the user
				    	console.log(err);
				    });
				}
			
			for(i in data.gallery)				
				data.gallery[i].src=data.gallery[i].img;
				
			$scope.items=data.gallery;			
			if(data.price==null) 
				{
				$scope.item.price	= data.base;
				$scope.item.base	= null;
				}
			else
				$scope.item.discount 	= 1-data.price/data.basePrice;
			});
	
	
	
	if($scope.colors==null)
		$ionicModal.fromTemplateUrl('colors.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.colors = modal;		    
		  });
	
	if($scope.modal==null)
	$ionicModal.fromTemplateUrl('description.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
		/*
		groups.query({shop:shop},function(data)
			{						
			$scope.groups=data;
			console.log(data)
			$scope.title=data[0].name;
			});
		
		pricing.query({shop:shop},function(data)
			{								
			$scope.pricing=data;
			});*/
    }])
    
.controller("indexSingleEditController",["popup","$sce","$ionicHistory","$stateParams","indexItems","$scope","$state","groups","pricing","config","upload",
                                         function(popup,$sce,$ionicHistory,$stateParams,items,$scope,$state,groups,pricing,config,upload)
    {			
	
	$scope.data = {};
	
	
	var shop= $stateParams.shop||config.shop.base;
	$scope.colors=false;
	$scope.addColors=function()
		{
		$scope.colors=true;
		}
	
	$scope.beacon=false;
	$scope.addBeacon=function()
		{		
		$scope.beacon=true;
		}
	
	$scope.groups=groups;
	$scope.addColor=function()
		{		
		upload.upload().then(null,null,function(e)
			{			
			if($scope.item.colors==null) $scope.item.colors=[];
			$scope.item.colors.push({image:e,name:"#"+($scope.item.colors.length+1),qta:1
			});			
			});		
		}
	$scope.addImage=function()
		{				
		upload.upload().then(null,null,function(e)
			{	
			$scope.item.gallery.push({img:e});			
			});		
		}
	$scope.inGroup=false;
	$scope.inGroupCount=function(data)
		{				
		if(data == null) data =$scope.item; 
		var result=0;
		angular.forEach(data.groups,function(item)
			{
			if(item.checked) result++;
			})	
		return result;
		}
	
	
	var alert=function(errors){
		var txt="<UL>";
		var pos=1;
		angular.forEach(errors, function(item){
			txt+="<LI>"+(pos++)+") "+item.txt+"</LI>";
			})
		txt+="</UL>"
		return popup.show("Errors",txt,[{text:"close"}]);
		}
	
	
	$scope.save=function(stateok)
		{
		debugger;
		var errors=[];				
		if(this.item.name=="") 					errors.push({txt:"choice a name"});		
		if($scope.inGroupCount(this.item)==0)	errors.push({txt:"choice at least one category"});
		if(this.item.gallery.length==0) 		errors.push({txt:"choice at least one image"});
		if(errors.length>0)						return alert(errors);
		
		var obj = 
			{
			"name":this.item.name,
			"id":this.item.id,
			"visible":this.item.visible,
			"code":this.item.code,
			"description":$sce.getTrustedHtml(this.item.description),
			"colors":this.item.colors,
			"prices":[],	
			"categories":[],
		 	"gallery":[],
		 	"qta":this.item.qta,
			"extra":this.item.extra,
			"shop":shop
		 	}		
		
		obj.gallery=this.item.gallery;
		angular.forEach($scope.item.groups,function(value,key)
			{						
			if(value.checked)
				obj.categories.push(value.id);
			})
		
		angular.forEach($scope.prices,function(value,currency)
			{
			
			angular.forEach(value,function(data,key){
				obj.prices.push({currency:currency,name:key,value:data,shop:shop});
				})			
			})
			
		$ionicHistory.nextViewOptions({
				  disableAnimate: true,
				  disableBack: true,
				  historyRoot:true
				});
		
		items.save(obj,function()
			{
			$state.go(stateok)
			});
		}
	$scope.addGroup=function(gr)
		{						
		if(gr.name=='' || gr.name.replace(/\s/g, '')=='') return;
		if($scope.item.groups.length==0) gr.checked=true;
		gr.shop=shop;
		$scope.item.groups.push(gr);		
		groups.save(gr);
		}
	
	$scope.group="";	
	$scope.data={groups:[]};
	$scope.prices={};
	var filter = function(data)
		{		
		if(data==null) data={groups:[],gallery:[]};		
		
		if(data.gallery==null) data.gallery=[];			
		$scope.colors=data.colors!=null;
		
		groups.query({shop:shop},function(groups)
			{							
			angular.forEach(groups,function(cat)
				{							
				try{cat.checked=data.categories.indexOf(cat.name)>=0;}catch(e){cat.checked=false;}				
				})			
			data.groups=groups;
			$scope.inGroupCount(data);
			});
		
		var getPrice=function(currency,name)
			{
			var price=null;
			angular.forEach(data.prices,function(item){
				if(item.currency==currency && item.name==name) 
					price= item.value;
				})
			return price;
			}
		
		pricing.query({shop:shop},function(pricings)
			{			
			var prices=$scope.prices;			
			angular.forEach(pricings,function(pricing)
				{
				if(prices[pricing.currency]==null)
					prices[pricing.currency]={};
				prices[pricing.currency][pricing.name]=getPrice(pricing.currency,pricing.name);												
				})
			
			data.pricing=pricings;			
			});
		try{$scope.$root.$broadcast("objUpdate");}catch(e){}
		return data;
		}	
	
	$scope.item=filter({id:Math.random(),name:"",groups:[],gallery:[]});
	//if($scope.$root.item!=null && $scope.$root.item.id==$stateParams.id) return;
	if(!$stateParams.id ||
		$stateParams.id==='new' ||	
		$stateParams.id==='') {
		
		$scope.$root.item=$scope.item;
		return;}
	
	items.get({id:$stateParams.id,shop:shop},function(data)
		{					
		$scope.item=filter(data);
		console.log($scope.item);
		$scope.$root.item=$scope.item;	
		
		},function(data){			
		$scope.item=filter({id:Math.random(),name:"",groups:[],gallery:[]});
		$scope.$root.item=$scope.item;	
		
		});
	
    }])
 .controller("wishController",["wish","basket","$scope","$stateParams",function(wish,basket,$scope,$stateParams)
    {			 
	 var list = []
	 if($stateParams.shop!=null)
		 angular.forEach(wish.list,function(item)
			{
			if(item.shop==$stateParams.shop)
				list.push(item);
			})
	else
		list = wish.list;
	 
	 $scope.filter="";
		$scope.wish=wish;
		$scope.basket=basket;
		$scope.list=list;
    }])
    

.controller("ordersAdminController",["$scope","order","$stateParams","config",function($scope,order,$stateParams,config){
	var shop = $stateParams.shop||config.shop.base;
	order.query({shop:shop},function(data){
		$scope.orders=data;
		})
	}])
.controller("ordersController",["user","$scope","order","$stateParams","config",function(user,$scope,order,$stateParams,config){
	var shop = $stateParams.shop;	
	order.query({shop:shop,user:user.mail},function(data){
		$scope.orders=data;
		})
	}])
		
.controller("orderController",["$ionicModal","popup","$scope","order","$stateParams","config","basketBank","community",function($ionicModal,popup,$scope,order,$stateParams,config,basketBank,community){
	var shop = $stateParams.shop;
	$scope.popup=popup;
	
	$ionicModal.fromTemplateUrl('vote.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	$scope.vote=function()
		{
		$scope.modal.show();
		}
	
	var orderStatus=function()
		{							
		$scope.order.status="topack";
		angular.forEach($scope.order.rows,function(item){
			if(item.inboxQta<item.qta && item.status!="closed") $scope.order.status="working";
			})
			
		$scope.order.$save();
		}
	$scope.send=function(order)
		{
		order.status="shipped";
		$scope.order.$save().then(function(data)
			{					
			community.sendMessage({
				from:	order.id,
				to	:	order.user,
				msg	:	$scope.shop.name+"\nIl tuo ordine è stato appena spedito\n"+data.shipping.courier+"-"+data.shipping.courierTrack,
				type:	"order"
				})
			});
		}
	$scope.voted=function(order)
		{		
		$scope.order.$save();
		$scope.modal.hide();
		}
	$scope.received=function(order)
		{
		order.status="closed";
		$scope.order.$save();
	    $scope.vote();
		}
	$scope.pack=function(order)
		{
		order.status="packed";
		$scope.order.$save();
		}
	$scope.add=function(item)
		{
		item.inboxQta++;
		if(item.inboxQta==item.qta) item.status="closed";
		orderStatus();
		}
	$scope.sub=function(item)
		{
		item.inboxQta--;
		item.status="open";
		orderStatus();
		}
	$scope.stop=function(item)
		{		
		item.status="closed";
		orderStatus();
		}
	order.get({id:$stateParams.id,shop:shop},function(data){		
		angular.forEach(data.rows,function(item)
			{			
			if(item.inboxQta==null) item.inboxQta=0;			
			});
	
		$scope.basket=data;
		$scope.order=data;
		})
	}])
.controller("paymentController",["$scope","basket","$ionicSideMenuDelegate",function($scope,basket,$ionicSideMenuDelegate)
   {
	
	$scope.setPayment=function(value)
		{			
		basket.get($scope.shop.id,function(bsk)
			{			
			bsk.payment=value;			
			})
		
		$scope.paymentModal.hide();		
		$ionicSideMenuDelegate.toggleRight();
		}
   }])
.controller("shippingController",["$scope","basket","$ionicSideMenuDelegate","$locale",function($scope,basket,$ionicSideMenuDelegate,$locale)
   {
	$scope.addresses=[];
	$scope.setShippingToShop=function(value)
		{
		value.name="Passo in negozio";
		this.setShipping(value);
		}
	$scope.addShipping=function(value)
		{
		$scope.addresses.push(value);
		$scope.setShipping(value);
		$scope.add=false;
		}
	$scope.setShipping=function(value,name, price)
		{							
		basket.get($scope.shop.id,function(bsk)
			{
			if(price==null)
				{
				var country 	= value.country.toLowerCase();
				var area	 	= null
				if(value.area!=null) area = value.area.toLowerCase();
				bsk.shipping=value;
				
				var curShipping = $scope.shop.shipping[$locale.NUMBER_FORMATS.CURRENCY];
				var shipping=null;
				angular.forEach(curShipping,function(price,sh)
					{
					if(sh=="europe")		sh="EU";
					if(sh=="world" && shipping==null) 	shipping	= price;
					if(sh==country) 					shipping	= price;
					if(sh==area && shipping==null) 		shipping	= price;
					});
				bsk.shipping.price=shipping;
				}
			else
				{
				bsk.shipping=value;
				bsk.shipping.price=price;
				bsk.shipping.name=name;
				}
			
			
			bsk.calc();
			})
		
		$scope.shippingModal.hide();		
		$ionicSideMenuDelegate.toggleRight();
		}
   }])
   
 .controller("basketController",["basket","$scope","$state","$ionicModal","$cordovaTouchID","$ionicSideMenuDelegate",
                         function(basket,$scope,$state,$ionicModal,$cordovaTouchID,$ionicSideMenuDelegate)
    {
	 $scope.inviaOrdine=function(basket)
		{		
		 var save=function()
			{
			basket.status="confirm";		
					
			basket.save().then(function(id)
				{													
				$scope.order=basket.toJSON();
				
				basket.clear();									
				$ionicSideMenuDelegate.toggleRight();
				});
			}
		 
		if(basket.shipping.name==null) return $scope.shipping();
		if(basket.payment.name==null) return $scope.payment();		
		
		if($cordovaTouchID.authenticate!=null)
			{
			$cordovaTouchID.authenticate("confermi l'ordine?").then(function() {
				save();
				basket.pay();
			  }, function () {
			    
			  });
			}
		else
			{
			save();
			basket.pay();
			}	
		}
	 
	 
	 $ionicModal.fromTemplateUrl('views/single/basket/payment.html', 
		{
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) 
		{		
		$scope.paymentModal = modal;
		});
	 $ionicModal.fromTemplateUrl('views/single/basket/shipping.html', 
		{
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) 
		{		
		$scope.shippingModal = modal;
		});
	 $scope.shipping=function()
		{		 
		$scope.shippingModal.show();
		$ionicSideMenuDelegate.toggleRight();
		}
	 $scope.payment=function()
		{		 
		$scope.paymentModal.show();
		$ionicSideMenuDelegate.toggleRight();
		}
    }])