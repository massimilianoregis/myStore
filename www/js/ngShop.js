angular.module("ngShop",["ngBase","ngCommunity","ngToast"])


.controller("shopWishController",["$scope","user","community","wish",function($scope,user,community,wish){
	var wish= wish.get("shops")
	$scope.wish={
			set:function(item)		{if(item.wish) this.remove(item); else this.add(item);},
			add:function(item)		{wish.add(item); item.wish=true; community.addUserRole({user:user.mail,role:item.id+".user"});},
			remove:function(item)	{wish.remove(item); item.wish=false; community.removeUserRole({user:user.mail,role:item.id+".user"});}
			}
	}])
.controller("shopListController",["community","user","popup","shop","$scope","popup","wish","ngToast","injectCSS","$rootScope","config","$locale",
                       function(community,user,popup,shops,$scope,popup,wish,ngToast,injectCSS,$rootScope,config,$locale){
	console.log("shopListController");
	
	
	injectCSS.set("custom",config.style);
	$rootScope.$on("$ionicView.Enter",function()
		{		
		injectCSS.set("custom",config.style);
		})
	$scope.data={
		options:{
			loop: false,
			effect: 'slide',
			speed: 500,			
			onSlideChangeStart:function()
				{
				$scope.$root.$emit("open-header");
				}
			}
	};	
	
	var wish= wish.get("shops")	
	shops.query(function(data)
		{		
		angular.forEach(data,function(item)
			{
			item.wish=wish.inside(item);
			item.setwish=function()		{if(this.wish) this.removeWish(); else this.addWish();};
			item.addwish=function()		{wish.add(this); this.wish=true; community.addUserRole({user:user.mail,role:this.id+".user"});};
			item.unwish=function()		{wish.remove(this); this.wish=false; community.removeUserRole({user:user.mail,role:this.id+".user"});};		
			})
			
		$scope.list=data;
		})
	
	$scope.$watch("search.value",function(data){
		$scope.secret=null;
		if(data==null || data.length!=8) return;		
		data=data.toUpperCase();
		angular.forEach($scope.list,function(item){
			if(item.code==data) $scope.secret=item;
		})			
	})
	$scope.delete=function(item)
		{
		popup.confirm("CANCELLARE","vuoi cancellare il negozio?",function(){item.$delete()});
		}
	
	
	}])
.controller("shopUsersController",["$scope","community","$stateParams",function($scope,community,$stateParams){
	var id = $stateParams.shop; 	
	community.usersByRole({role:id+".user"},function(data){
		$scope.list=data;
		})
	}])

.controller("shopController",["goodType","$cordovaFacebook","$timeout","$ionicModal","popup","wish","gps","$ionicSlideBoxDelegate","goodClass","community","$state","$rootScope","$state","injectCSS","$scope","upload","shop","$stateParams","config","user","basket","$locale",
                      function(goodType,$cordovaFacebook,$timeout,$ionicModal,popup,wish,gps,$ionicSlideBoxDelegate,goodClass,community,$state,$rootScope,$state,injectCSS,$scope,upload,shop,$stateParams,config,user,basket,$locale){	
	var id = $stateParams.shop;	
	$scope.data = {};	
	
	
	$scope.fb={
		showPagesList:function(){
			$ionicModal.fromTemplateUrl('views/admin/shop/FBimport.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			  }).then(function(modal) {				  
			    $scope.fb.modal = modal;		    
			    $scope.fb.modal.show();			    
			  });		
			},
		pages:function(){			
			this.showPagesList();
			$scope.fbPage=[];
			//$cordovaFacebook.api("me/accounts?fields=name,access_token,link,picture{url},cover,phone,category,emails,genre,description,contact_address,location,website", ["manage_pages"])
			
			$cordovaFacebook.api("me/accounts?fields=name,description,cover,picture", ["manage_pages"])
			    .then(function(success) {
			    	console.log(success);
			    	angular.forEach(success.data,function(item){
			    		var it = {
			    				id:item.id,			    				
			    				name:item.name,
			    				description:item.description
			    				};
			    		if(item.picture) 	it.logo			=	item.picture.data.url;
			    		if(item.cover) 		it.background	=	item.cover.source;
			    		$scope.fbPage.push(it);    		
			    	})    	
			    });			
			},
		import:function(item){			
			$scope.fb.modal.hide();			
			$scope.shop.name=item.name;
			$scope.shop.gallery=[];
			if(item.background)	$scope.shop.gallery.push({img:item.background});
			if(item.logo)		$scope.shop.gallery.push({img:item.logo});
			}
		};
	
	$scope.colorChoice=function(item)
		{
		$scope.colorItem=item;
		$scope.colors.show();		
		}
	if($scope.colors==null)
		$ionicModal.fromTemplateUrl('colors.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
			
		    $scope.colors = modal;		    
		    $scope.colors.add=function(basket,item,color)
		    	{		    	
		    	basket.add(item,{color:color});
		    	$scope.colors.hide();
		    	}
		  });
	
	
	goodClass.query(function(data){		
		$scope.goodClasses=data;
		$scope.classChildren=[];
		$scope.classRoot=function(){
			$scope.firstLevel=null;
			$ionicSlideBoxDelegate._instances[0].previous();
			//$ionicSlideBoxDelegate.$getByHandle("classes").previous();
			}
		$scope.selectClass=function(item){					
			$scope.firstLevel=item;
			if($scope.firstLevel.selected==null)	$scope.firstLevel.selected=0;
			$scope.classChildren=item.children;	
			angular.forEach(item.children,function(item){
				item.selected=$scope.shop.goodClasses.indexOf(item)>=0;
				})			
			//$ionicSlideBoxDelegate.$getByHandle("classes").next()
			$ionicSlideBoxDelegate._instances[0].next();
			}
		$scope.addClass=function(item){			
			if(!item.selected)
				{
				$scope.firstLevel.selected--;
				$scope.shop.goodClasses.splice($scope.shop.goodClasses.indexOf(item),1);
				}
			else
				{				
				$scope.firstLevel.selected++;
				$scope.shop.goodClasses.push(item);
				}		
			}
		});
	basket.get(id,function(bsk){$scope.basket=bsk;});
	
	$scope.shop=
		{
		name:"",
		type:null,
		gallery:[],
		goodClasses:[],
		currencies:[{name:"EUR"},{name:"USD"}]
		};
	$scope.sendShop=function()
		{			
		popup.prompt("Invia","vuoi inviare una mail per regalare questo negozio?","prova@mail.it",function(res){
			console.log(res);
			});
		};
	$scope.visible=function()
		{
		popup.confirm("Apri","Sei pronto? vuoi rendere visibile a tutti il tuo negozio?",function()
			{
			$scope.shop.visible=true;
			$scope.saveShop();
			});
		};
	//oggetto per strutturazione dello shipping
	var shippingData=function(shop)
		{
		var list=[];
		angular.forEach(shop.shipping,function(cur,currency)
			{
			angular.forEach(cur,function(value,country)
				{
				list.push({currency:currency,price:value,country:country});
				});
			});
		return list;
		}
			
	var shippingValue = function(currency,country){
		var price=null;
		angular.forEach($scope.shop.shipping,function(item){
			if(item.currency==currency && item.country==country)
				price=item.price;
			});
		return price;
		}
	var loadShop=function(data)	{
		if(data==null) return;
		$scope.$root.shop={style:data.style};			
		injectCSS.set("custom",data.style);
		if(data.addresses==null) data.addresses=[];
		$scope.shop=data;
		var shipping={};						
		var currencies=[];			
		$scope.owner=false;
		angular.forEach(data.staff,function(item){
			if(item.mail==user.mail) $scope.owner=true;
			})
		angular.forEach(data.currencies,function(cur)
			{				
			shipping[cur]={};
			shipping[cur].italy=shippingValue(cur,'italy');
			shipping[cur].europe=shippingValue(cur,'europe');
			shipping[cur].world=shippingValue(cur,'world');
			currencies.push(cur)
			})
			
		try{$scope.shop.notifyMail=data.staff[0].mail;}catch(e){}		
		if(currencies.length==0) currencies=["EUR"];
		$scope.shop.currencies=currencies;
		$scope.shop.shipping=shipping;
	
		if($scope.shop.placeholder==null) $scope.shop.placeholder=config.placeholder;
		$scope.shop.wish=wish.inside($scope.shop);
		$scope.shop.setWish=function()		{if(this.wish) this.removeWish(); else this.addWish();};
		$scope.shop.addWish=function()		{wish.add(this); this.wish=true; if(!user.canAccess(this.id+".user")) community.addUserRole({user:user.mail,role:this.id+".user"});};
		$scope.shop.unWish=function()		{wish.remove(this); this.wish=false; if(user.canAccess(this.id+".user")) community.removeUserRole({user:user.mail,role:this.id+".user"});};
		$scope.shop.payments=[];	
		if(data.paypal && window["paypal"])
			{
			paypal.init(data.email,data.paypal.clientId);
			$scope.shop.payments=["paypal"];
			}
		
		if($scope.shop.payments.length==1)
			$scope.basket.payment.name=$scope.shop.payments[0];
		if($scope.shop.payments.length==0)
			$scope.basket.payment.name="";
				
		goodType.setTypes($scope.shop.goodTypes);
		$locale.NUMBER_FORMATS.CURRENCY="EUR";
		$locale.NUMBER_FORMATS.CURRENCY_SYM="€";
		$locale.NUMBER_FORMATS.DEFAULT_PRECISION=2;	
		$rootScope.currency="EUR";
		}
	
	if(id!=null)
		shop.get({id:id},function(data){	
			loadShop(data);
			})
			
	$scope.go=function(go){
		console.log(go);
		$state.go(go);
	}		
	$scope.here=function(){
		
		gps.refresh().then(function(position)	{
			$scope.shop.gps={latitude:position.coords.latitude,longitude:position.coords.longitude}
			})
		}
	$scope.changeLogo=function(){
		upload.upload().then(null,null,function(data)
			{
			$scope.shop.logo=data;
			})
		}	
	$scope.changeBackground=function(){
		upload.upload().then(null,null,function(data)
			{
			$scope.shop.background=data;
			})
		}	
	$scope.addImage=function(){				
		upload.upload(1080,750).then(null,null,function(data)
			{
			$scope.shop.gallery.push({img:data});
			})
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
	function currenciesCount(data)
		{				
		if(data == null) data =$scope.shop; 
		var result=0;
		angular.forEach(data.currencies,function(item)
			{
			if(item.selected) result++;
			})	
		return result;
		}
	
	$scope.saveShop=function(go){		
		var errors=[];
			
		if($scope.shop.name=="")	 			
			{
			errors.push({txt:"choice a name"});
			$scope.sliding($scope.data.slider,'categorie');
			$scope.enterName=true;			
			}
		if($scope.shop.goodClasses.length==0)	
			{
			errors.push({txt:"at least one category"});
			if(errors.length==1) $scope.sliding($scope.data.slider,'categorie');
			$scope.enterClasses=true;
			}
		if(currenciesCount($scope.shop)==0)
			{
			errors.push({txt:"at least one currency"});
			if(errors.length==1) $scope.sliding($scope.data.slider,'currencies');			
			}
		if($scope.shop.gallery.length==0)		
			{
			errors.push({txt:"at least one photo"});				
			if(errors.length==1) $scope.sliding($scope.data.slider,'gallery');			
			}
		if($scope.shop.style==null)				
			{
			errors.push({txt:"at least one style"});
			if(errors.length==1) $scope.sliding($scope.data.slider,'style');
			}
		if(errors.length>0)						return alert(errors);		
		
		if($scope.shop.background==null) $scope.shop.background=$scope.shop.gallery[0].img;
		var newShop = $scope.shop.id==null;

		var sh = angular.extend({},$scope.shop);
		
		sh.gallery=[]
		angular.forEach($scope.shop.gallery,function(item){			
			sh.gallery.push(item.img);
		});
		
		var currencies=[];
		angular.forEach($scope.shop.currencies,function(item){
			if(item.selected)
				currencies.push(item.name);
		});		
		
		angular.forEach(sh.pricings,function(item){item.shop=null;});		
		if(sh.whoarewe!=null) sh.whoarewe.id=null;
		
		sh.shipping= shippingData($scope.shop);	
		sh.currencies=currencies;
		console.log("saving shop:");
		console.log(sh);
		var promise = shop.save(sh,function(data)
			{			
			loadShop(data)
			if(!newShop && go) return $state.go(go,{shop:$scope.shop.id});
			if(!newShop) return;								
			
			if(user.shop==null || typeof user.shop != "object") user.shop=[];
			$scope.shop.code=data.code;
			user.shop.push($scope.shop.id);
			
			user.data.shop=user.shop;			
			community.save(user);		
			
			$state.go("pub.admin.settings",{shop:$scope.shop.id});
			}).$promise;
		
		}
	
	}])
.factory("goodClass",["$cacheFactory","$resource","config",function($cacheFactory,$resource,config){
	var cache = $cacheFactory('goodClass');   
	var result =  $resource(config.index.url.classes, {id: '@id'},{
		   query:
			{
			isArray:true,
			method:'GET',
			url:config.index.url.classes,
			cache:cache,
			responseType:'json'				
			},
			save:
			{
			method:'POST',
			url:config.index.url.classes,			
			responseType:'json',
			transformRequest:function(data){
				cache.removeAll();			
				return angular.toJson(data);
			}
			}
	   	});	
	return result;
	}])
.factory("shop",["$cacheFactory","$resource","config",function($cacheFactory,$resource,config){
	var cache = $cacheFactory('shop');   
	var result =  $resource(config.location.url.item, {id: '@id'},
		{
		query:
			{
			isArray:true,
			method:'GET',
			url:config.location.url.item,
			cache:cache,
			responseType:'json'				
			}, 
		get:
			{
			method:'GET',
			url:config.location.url.item,
			cache:cache,
			responseType:'json'				
			},
		save:
			{
			method:'POST',
			url:config.location.url.item,			
			responseType:'json',
			transformRequest:function(data){
				cache.removeAll();			
				return angular.toJson(data);
			}
			},
		listByStaff:
			{
			isArray:true,
			cache:cache,
			method:'GET',
			url:config.shop.url.listByStaff,
			params:{mail:''},
			responseType:'json'				
			},
		sendNotify:
			{
			method:'GET',
			url:config.shop.url.sendNotify,
			params:{from:'',message:'',shop:'',type:''},
			responseType:'json'				
			},
		sendMessage:
			{
			method:'GET',
			url:config.shop.url.sendMsg,
			params:{mail:'',message:'',shop:''},
			responseType:'json'				
			},
		answer:
			{
			method:'GET',
			url:config.shop.url.answer,
			params:{to:'',message:'',shop:''},
			responseType:'json'				
			}
		});	
	return result;
	}])
.factory("news",["$resource","config","$stateParams",function($resource,config,$stateParams){		
	var result =  $resource(config.news.url.item, {id: '@id',shop:$stateParams.shop});	
	return result;
	}])
.controller("newsController",["news","$scope",function(news,$scope){	
	news.query(function(data){
		$scope.list =data;
	});
}])
.controller("newsItemController",["$scope","upload","news","$state",function($scope,upload,news,$state){	
	$scope.setImage=function(){		
		upload.upload().then(null,null,function(e)
			{						
			$scope.item.image=e;			
			});	
		};
	$scope.save=function(state){
		news.save($scope.item,function(){
			$state.go(state);
			});
		}
	$scope.item={
		title:"Nuovo",
		text:"",
		image:""
		}
	}])
.controller("shopAddressController",["pubs","$scope","$state","user","$ionicNavBarDelegate",function(shop,$scope,$state,user,$ionicNavBarDelegate)
    {
	var id 		= $state.params.address;
	var shopId 	= $state.params.shop;	
	
	
	$scope.address	={};
	$scope.type		={home:false,work:false};
	
	$scope.shop={addresses:[]};
	shop.get({id:shopId},function(data)
		{
		if(data.addresses==null) data.addresses=[];
		$scope.shop=data;
		if(id!=null)
			{
			var address	=data.addresses[id];		
			$scope.type		={
						home:address.type=='home',
						work:address.type=='work'
						};
			angular.extend($scope.address,address);
			}
		})	
	
	$scope.save = function()
		{
		if(id==null) 	$scope.shop.addresses.push($scope.address);
		else			$scope.shop.addresses[id]=$scope.address;
		if($scope.type.work)	$scope.address.type ='work';
		if($scope.type.home)	$scope.address.type ='home';
		$ionicNavBarDelegate.back();
		}
	
    }])
.controller("adminController",["pubs","$stateParams","$scope",function(shop,$stateParams,$scope){	
	shop.get($stateParams.shop,function(data){
		$scope.shop=data;
		$scope.$root.shop=data;
		});
	}]);