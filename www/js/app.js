if(window.cordova!=null)		angular.module('app', ['inpubCordova']);						
else							angular.module('app', ['inpub','ngCordovaMocks']);
console.log("-->cordova?");

if(window.cordova!=null) console.log("-->cordova!");		

angular.module("inpub",[
                        //---i18n---
                        //"tmh.dynamicLocale",
                        //"pascalprecht.translate",  
                        "angular-svg-round-progress",
                        "paypal",
                        //"ImageCropper",  
                        "ngShop",
                        "ionic-img-lazy-load",
                        "ionic",'ionic.service.core',
                        "ngBase",
                        "ngIndex",                        
                        "ngCommunity",
                        "ngBlog",
                        //"firebase",
                        "uiGmapgoogle-maps",
                        //"ngUpload",
                        //"ngTagsInput",                        
                        //"wu.masonry",
                        "walkthrough",
                        "ion-gallery",  
                        "ngShop",
                        //"resourcePouch",
                       // "resourceFirebase",
                        "ionic.ion.headerShrink",
                        "ja.qr",
                        "monospaced.elastic",
                        "imagenie"
                        	])
.service("$cordovaTouchID",function()
		{
		return {};
		})
.constant('$ionicLoadingConfig', {
	template: ' <ion-spinner class="light"></ion-spinner><!--img src="img/placeholder.jpg" style="width:100px; animation:pulse 2s infinite;" class="animated"--><br/><span>{{loader.info}}</span>'
})
.factory("messages",["$resource","config",function($resource,config){	
	var result =  $resource(config.messages.url.list, {from: '@from',to:'@to'},
		{
		list:
			{
			isArray:true,
			method:'GET',
			url:config.messages.url.list,
			params:{from:'',to:''},
			responseType:'json'				
			}
		});	
	return result;
	}])
.service("templates",["$resource",function($resource){
	return $resource("http://95.110.228.140:8080/openIndex/template/templates.json");
}])
.controller("templateController",["$scope","templates",function($scope,templates)
    {
	$scope.select=function(item)
		{
		$scope.active = item.name;
		$scope.shop.style=item.style;
		}
	templates.query(function(data){
		$scope.list=data;
		})
	
    }])
.controller("messageController",["$rootScope","$ionicScrollDelegate","$interval","$state","$scope","user","shop","messages","community",
                         function($rootScope,$ionicScrollDelegate,$interval,$state,$scope,user,shop,messages,community){			    
    $scope.mail		=	$state.params.mail;
    
    var timeout=null;
    var footerBar 	= 	document.body.querySelector('.message-footer');
    var scroller 	= 	document.body.querySelector('.messageFS .scroll-content');
        
    /*
    $scope.$on("$ionicView.enter",function(e,toState)
    	{    	
    	tobeload=true;
    	load();    	
    	if(timeout==null)
			timeout=$interval(function()
				{						
				load();
				},20000);
    	
    	});
    $scope.$on("$ionicView.leave",function(e,toState)
    	{
    	tobeload=false;    	
    	if(timeout!=null) $interval.cancel(timeout)    	
    	});
    	*/
    $scope.$on('taResize', function(e, ta) {
        if (!ta) return;

        var taHeight = ta[0].offsetHeight;
        if (!footerBar) return;

        var newFooterHeight = taHeight + 10;
        newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

        footerBar.style.height = newFooterHeight + 'px';
        if(scroller!=null) scroller.style.bottom = newFooterHeight + 'px';
      });
    
    
    var tobeload;
    var load = function(){
    	if(!tobeload) return;
    		
    	var msg=null;
    	if($scope.shop.id)
    		{
	    	if($state.includes("pub.admin"))
	    		try{msg = {from:$scope.shop.id,to: $scope.client.mail};}catch(e){ return;}
	    	else if(user.mail!=null)
	    		try{msg={from:$scope.shop.id,to: user.mail};}catch(e){ return;}
    		}
    	if(msg==null) return;    	    	
		messages.list(msg,function(data)
			{
			if(!tobeload) return;
			$ionicScrollDelegate.scrollBottom(true);
			$scope.data=data;					
			});		
	    }
    $scope.$watch("shop",load);    	
    $scope.$watch("client",load);
    
    $scope.message="";   
	$scope.data=[];
	             
	
	$scope.sendToShop=function(message)
		{			
		var text = user.firstName+":\n "+message;
		$scope.message="";
		
		shop.sendMessage({shop:$scope.shop.id,message:text,from:user.mail});			
		$scope.data.push({from:user.mail,message:message});
		}
	$scope.sendToUser=function(message,to)
		{		
		var text = $scope.shop.name+":\n"+message;
		$scope.message="";
		
		shop.answer({shop:$scope.shop.id,to:$scope.client.mail,message:text});		
		$scope.data.push({from:$scope.shop.id,message:message});
		}
	$scope.send=function(from, to, message)
		{
		var text = from+":\n "+message;
		$scope.message="";
		community.sendMessage({from:from,mail:to,message:text});			
		$scope.data.push({from:from,message:message});
		}
	}])
.run(["$rootScope","$ionicPlatform","community",function($rootScope,$ionicPlatform,community){
	    
	 $ionicPlatform.ready(function() {
		 	

		    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		      
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		      cordova.plugins.Keyboard.disableScroll(true);

		    }
		    
		    if(window.StatusBar) 
				{
				StatusBar.overlaysWebView(false);
				StatusBar.backgroundColorByHexString('#387ef5');
				}
		    
		    console.log("-----AUTOLOGIN----");
			community.autoLogin();
		  });
	
	
	$rootScope.showFooter = false;

		
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('community.profile') > -1)
	    {
	    document.location.href="#/list"	     
	    }
	  });		
	
}])
.factory("gps",["$q",function($q)
    {
	var gps = 
		{
		latitude:null,
		longitude:null,
		follow:function()
			{
			var deferred = $q.defer();
			act = this;
			this.refresh(function()
				{				
				deferred.notify({latitude:act.latitude,longitude:act.longitude})
				act.follow();
				})
			return deferred.promise;
			},
		refresh:function(callback)
			{
			var deferred = $q.defer();
			var act = this;
		
			navigator.geolocation.getCurrentPosition(function(position)
				{				
				//position ={"timestamp":1419368552972,"coords":{"speed":null,"heading":null,"altitudeAccuracy":null,"accuracy":37,"altitude":null,"longitude":-118.253804,"latitude":34.056915}};
				act.latitude=position.coords.latitude;
				act.longitude=position.coords.longitude;
				deferred.resolve(position);
				})			
				
			return deferred.promise;
			}
		}
	
	navigator.geolocation.getCurrentPosition(function(position)
		{
		gps.latitude=position.coords.latitude;
		gps.longitude=position.coords.longitude;
		});
	return gps;
    }])
    
.service("distance",["$q",function($q)
    {
	
	this.distance=function(start,end) {
		  var deferred = $q.defer();
		  if(start==null) start = "los angeles, ca";
		  if(end==null)	 end = "las vegas, nv";
		  var request = {
		      origin:start,
		      destination:end,
		      travelMode: google.maps.TravelMode.DRIVING,
		      unitSystem: google.maps.UnitSystem.METRIC 
		  };
		  
		  directionsService.route(request, function(response, status) 
			{			
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		      
		      deferred.resolve({
		    	  duration:response.routes[0].legs[0].duration.text,
		    	  distance:response.routes[0].legs[0].distance.text
		    	  })		      		      
		    }
		  });
		return deferred.promise;
		}
    }])
.controller("listaNegoziUserController",["user","shop","$scope","$rootScope",function(user,shop,$scope,$rootScope){
	$scope.list=[];
	
	
	var calcolo = function()
		{
		if(user.mail==null) return;
		shop.listByStaff({mail:user.mail},function(data){
			$scope.list=data;
			});		
		}
	calcolo();
	
	$rootScope.$on("logged",calcolo);
	}])    
.controller("mapController",["$scope","gps","uiGmapIsReady","config",function($scope,gps,uiGmapIsReady,config)
    {	
	
	var directionsService;
	var directionsDisplay;
	var start;
	
	var calcRoute = function(start,end) {
		console.log("calcRoute:"+end);
		  if($scope.duration!=null) return;
		  if(start==null) start = "los angeles, ca";
		  if(end==null)	 end = "las vegas, nv";		  
		  var request = {
		      origin:start,
		      destination:end,
		      travelMode: google.maps.TravelMode.DRIVING,
		      unitSystem: google.maps.UnitSystem.METRIC 
		  };
		  
		  directionsService.route(request, function(response, status) 
			{
			
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		      
		      $scope.duration=response.routes[0].legs[0].duration.text;
		      $scope.distance=response.routes[0].legs[0].distance.text;
		      $scope.$apply();
		    }
		  });
		}
	
	uiGmapIsReady.promise(1).then(function(instances) {
		 directionsService = new google.maps.DirectionsService();
		 directionsDisplay = new google.maps.DirectionsRenderer();
	        instances.forEach(function(inst) {
	        	var map = inst.map;
	        	
	    		directionsDisplay.setMap(map);
	    		
	    		try{calcRoute(start,config.data.address);}catch(e){}
	        });
	 });	
	
	gps.refresh().then(function(pos){
		var stylecolor = [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}];
		$scope.map = {id:12,center: gps,zoom:9, options:{styles: stylecolor,streetViewControl:false,zoomControl:false,scaleControl:false,mapTypeControl:false}};		
		start = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
		
		try{calcRoute(start,config.data.address);}catch(e){}
		})
    }])
.controller("hoursController",["$scope",function($scope)
    {	
	$scope.times=[];
	var date = new Date();
	if(date.getMinutes()<30) 	date.setMinutes(30);
	else						date.setMinutes(0);
	
	var start 	= new Date(); start.setHours(8); start.setMinutes(00)
	var end 	= new Date(); end.setTime(date.getTime()+18000000);
	
	while(date.getTime()<end.getTime())
		{		
		var time = new Date(); time.setTime(date.getTime());
		$scope.times.push(time);
		date.setTime(date.getTime()+1800000);
		}
	
    }])

.controller("orderWaitController",["$scope","orders",function($scope,orders){
	$scope.basket=orders.act;
	}])
.service("notification",["$resource","$ionicPlatform","$http","config","$state",function($resource,$ionicPlatform,$http,config,$state){
	return {
		init:function(mail)
			{
			
			$ionicPlatform.ready(function(){
				/* <push notification> */		
				console.log("notifications");	
				
				var push = new Ionic.Push({
					//debug:true,
					"onNotification": function(notification) {						
					    var payload = notification.payload;
					    console.log("-------------------------------");
					    console.log(payload);
					    console.log("-------------------------------");
					    if(payload.type=="chat.shop")					    						    
					    	$state.go("pub.admin.users.single.messages",{shop:payload.to,mail:payload.from})
					    if(payload.type=="chat.user")	
					    	$state.go("pub.messages.single",{shop:payload.from})
					    if(payload.type=="order" && payload.target=="shop")
					    	$state.go("pub.admin.orders.item",{shop:payload.to,id:payload.from})
					    if(payload.type=="order" && payload.target=="user")
					    	$state.go("pub.order",{id:payload.from})
					  },
					  "onRegister": function(data) {
					    console.log(data.token);
					    $resource(config.community.url.device,{mail:mail,id:data.token}).query();					    
					  },
					pluginConfig: {
					    "ios": {
					      "badge": true,
					      "sound": true
					     }
					  } 
					});	
				if(window.PushNotification!=null)	push.register();
				console.log("/notifications");	
				/* </push notification> */
				});
			}
	};
}])
.controller("appController",["countries","$interval","$ionicLoading","$timeout","$sce","ngToast","$locale","notification","$cordovaTouchID","$cordovaVibration","$cordovaToast","$rootScope","$ionicPlatform","$ionicNavBarDelegate","community","shop","$cordovaSocialSharing","pubs","$stateParams","$scope","groups","$ionicSlideBoxDelegate","config","$ionicModal","$ionicSideMenuDelegate","basket","popup","user","$http","order","$ionicScrollDelegate","$state","currency",
                             function(countries,$interval,loader,$timeout,$sce,ngToast,$locale,notification,$cordovaTouchID,$cordovaVibration,$cordovaToast,$rootScope,$ionicPlatform,$ionicNavBarDelegate,community,shop,$cordovaSocialSharing,pubs,$stateParams,$scope,groups,$ionicSlideBoxDelegate,config,$ionicModal,$ionicSideMenuDelegate,basket,popup,user,$http,order,$ionicScrollDelegate,$state,currency)
    {				
	
	$scope.sliding=function(slider,name)
		{
		
		var pos=0;
		for(i in slider.slides)
			{			
			try{if($(slider.slides[i]).attr("name")==name)			
				slider.slideTo(pos);				}
			catch(e){}
			
			pos++;
			}
		}
	
	$scope.openHeader=function(){
		$scope.$root.$emit("open-header");
	}
	//comunicazioni
	/*
	$timeout(function()
		{
		var toast = ngToast.info({
			dismissButton:true,			
			content:$sce.trustAsHtml("<a ui-sref=\"shop.new\">Vorresti avere un negozio tutto tuo?</a>"),
			compileContent: true,					
			timeout:600000,
			dismissOnTimeout:true,
			horizontalPosition:"center"
			});
		},100000);*/
	
	
	$rootScope.$on("logged",function(){console.log($locale); notification.init(user.mail)});	
	$scope.version=config.version;
	
	
	$scope.currs={
		EUR:{symbol:"€",fractionSize:2},
		USD:{symbol:"$",fractionSize:2}
		};
	
	$rootScope.$on("basket:add",function(e,data){		
		$cordovaVibration.vibrate(100);		
		
		$scope.data=data.obj;		
		$scope.openBasket=function()
			{
			$ionicSideMenuDelegate.$getByHandle('menu').toggleRight();
			}
		
		var toast = ngToast.info({
			dismissButton:true,			
			content:$sce.trustAsHtml("<a ng-click=\"openBasket()\">added '{{data.name}}' to Basket</a>"),
			compileContent: true,					
			horizontalPosition:"center"
			});
		
		/*
		
		$cordovaToast.showLongTop("added '"+data.obj.name+"' to Basket").then(function(result){
			console.log(result);
			if(result!=null && result.event=='touch')	$ionicSideMenuDelegate.$getByHandle('menu').toggleRight();
			});*/
	})
	
	$scope.user=user;
	$scope.config=config;			
	$scope.saving=false;
	$scope.back=function()
		{		
		$ionicNavBarDelegate.back();
		}
	
	$scope.launch=function(url)
		{
		var match = url.match(/^(myshop?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
		match = match && {
	        protocol: match[1],
	        host: match[2],
	        hostname: match[3],
	        port: match[4],
	        pathname: match[5],
	        search: match[6],
	        hash: match[7]
	    }
		$scope.url=match.host;
		if(match.host=="login")
			{			
			var id = match.pathname.substring(1);
			console.log(id);
			community.otp({id:id},function(){			
				$state.go("^.profile");
				},function(){		
				});			
			}		
		}
	$scope.go=function(go,data){
		$state.go(go,data);
		}
	$scope.saveBasket=function(basket)
		{		
		$scope.saving=true;
		//firebaseSave.saveBasket(basket).then(function(){$scope.saving=false;})
		}
	
	/*-----UPDATE------*/	
	/*
	$scope.update=
	{		
	progress:0,		
	show:function()
		{
		if((new Date()-this.time)<1800000) return;
		this.modal.show();
		},
	close:function()
		{
		this.time=new Date();
		this.modal.hide();
		},
	install:function()
		{
		deploy.update().then(function(deployResult) {
				$scope.update.modal.hide();
			}, function(deployUpdateError) {
			  // fired if we're unable to check for updates or if any 
			  // errors have occured.
			}, function(deployProgress) {
				$scope.update.progress=deployProgress;					
				try{$scope.$apply();}catch(e){}					
			});
		}
	}
	
	var deploy = new Ionic.Deploy();
	deploy.setChannel("production");	
	deploy.watch().then(function() {}, function() {}, function(deployUpdateAvailable) {
		console.log("new update available!!");
		deploy.getMetadata().then(function(metadata)
			{
			console.log("new update: ");
			console.log(metadata);
			$scope.update.info=angular.fromJson(metadata);
			if(!metadata.silent)			
				$scope.update.show();
			else
				$scope.update().install();
			console.log($scope.update.info);
			try{$scope.$apply();}catch(e){}	
			})
			
		deploy.info().then(function(deployInfo) {
			
			$scope.update.info=deployInfo;
			console.log(deployInfo);
			}, function() {}, function() {});
		});
				
	$ionicModal.fromTemplateUrl('update.html', 
			{
		    scope: $scope,
		    animation: 'slide-in-up'
			}).then(function(modal) 
			{
		    $scope.update.modal = modal;		    
			});
		*/
	/*-----/UPDATE------*/
	
	/*
	var x = $stateParams.shop||config.shop;
	
	debugger;
	groups.query({shop:$stateParams.shop||config.shop},function(data)
		{			
		$scope.groups=data;
		console.log(data)
		$scope.title=data[0].name;
		});
	*/
	
	$scope.share=function(title,text,img,link)
		{
		console.log("sharing...");
		$cordovaSocialSharing
		    .share(title, text,img , link) // Share via native share sheet
		    .then(function(result) {
		      console.log("shared")
		    }, function(err) {
		      // An error occured. Show a message to the user
		    });
		}
	
	
    }])
.controller("sliderController",["$timeout","$rootScope","$state","$scope","$ionicScrollDelegate","$ionicSlideBoxDelegate",function($timeout,$rootScope,$state,$scope,$ionicScrollDelegate,$ionicSlideBoxDelegate){
	$scope.active=$state.params.group;
	$scope.hasBack=false;
	$scope.hasNext=true;
	$scope.current=0;	
	$scope.slide=$ionicSlideBoxDelegate;
	$scope.$on("objUpdate",function()
		{
		$scope.updateSlider();
		});
	
	$scope.change=function()
		{
		$ionicSlideBoxDelegate.update();
		
		$timeout(function(){
			var ind= $ionicSlideBoxDelegate.currentIndex()|0;		
			try{$rootScope.activeGroup=$scope.groups[ind].name;}catch(e){}			
			
			$scope.hasBack = ind>0;
			$scope.hasNext = ind<($ionicSlideBoxDelegate.slidesCount()-1);
			if(ind>=$ionicSlideBoxDelegate.slidesCount()) 
				{
				$ionicSlideBoxDelegate.previous();
				ind--;
				}
			$scope.current=ind;	
		},0);
		}
	$scope.nextSlide=function()
		{		
		$ionicSlideBoxDelegate.next();			
		}
	$scope.backSlide=function()
		{
		
		$ionicSlideBoxDelegate.previous();	
		}
	$scope.updateSlider = function (index) {					    	    
	    $scope.change();
	    $scope.slideTo(index);
		}
	$scope.slideTo = function (index) {
		if(index<0) return;
		if(index>=$scope.slide.slidesCount()) return;
		$scope.slide.slide(index,1000);
		}
	}])    
.factory("pubs",["resourceCache","config",function($resource,config){	
	return $resource(config.location.url.item)
}])
.controller("pubMapController",function($scope,pubs,uiGmapIsReady,$ionicSlideBoxDelegate){
	uiGmapIsReady.promise(1).then(function(instances) 
		{
        instances.forEach(function(inst) 
        	{
            $scope._map = inst.map;                    	
        	});
		});
	
	
	$scope.map = 
	 	{ 
		center: { latitude: 45.35916648112413, longitude: 9.158261962906337 }, 
		zoom: 14 
		};
	
	pubs.query(function(data)
		{
		$scope.list=[];
		angular.forEach(data,function(dt,i)
			{						
			if(dt.position==null) 		dt.position={lat:0,lng:0};
			if(dt.position.lat==null) 	dt.position={lat:0,lng:0};
			dt.pos= {latitude:dt.position.lat,longitude:dt.position.lng};
			$scope.list.push(dt);			
			});		
		});
     $scope.currentSlide=0;
	 $scope.slideHasChanged=function(index)
	  	{
	    var coord=$scope.list[index].pos;
	    $scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
	    $scope._map.panTo(new google.maps.LatLng(coord.latitude, coord.longitude));
	  	}
	 
	 
	})
.controller("pubHomeController",function($scope,$stateParams,config,location,pubs)
	{
	console.log($stateParams.shop);
	
	pubs.get({id:$stateParams.shop},function(data){
		$scope.shop=data
		$scope.$root.shop={style:data.style};
		})
	/*
	location.get({id:$stateParams.shop},function(data)
		{		//
		angular.extend(data,data.extra)
		data.data={address:data.position.lat+","+data.position.lng};
		angular.extend(config,data);
		})
	*/
	})
.controller("pubListController",function($scope,pubs){
	pubs.query(function(data){$scope.list=data});
})
  .directive('ionSearch', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                getData: '&source',
                model: '=?',
                search: '=?filter',
                placeholder :'@placeholder'
            },
            link: function(scope, element, attrs) {
                attrs.minLength = attrs.minLength || 0;
                //scope.placeholder = attrs.placeholder || '';
                scope.search = {value: ''};

                if (attrs.class)
                    element.addClass(attrs.class);

                if (attrs.source) {
                    scope.$watch('search.value', function (newValue, oldValue) {
                        if (newValue.length > attrs.minLength) {
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                            });
                        } else {
                            scope.model = [];
                        }
                    });
                }

                scope.clearSearch = function() {
                    scope.search.value = '';
                };
            },
            template: '<div class="item-input-wrapper">' +
                        '<i class="icon ion-android-search"></i>' +
                        '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                      '</div>'
        };
    })
    
    //amministrazione dati
    .factory("location",["$resource","config",function($resource,config)
    	{
    	return $resource(config.location.url.item)
    	}])
    .factory("linkCard",["$http","config",function($http,config){
    	return {
    		add:function(location)
    			{    			
    			return $http({
    				method:"GET",
    				url:config.location.url.addlink,
    				params:{location:location}
    				});
    			}
    		};
    	}])
    .controller("shotController",["$scope","location","gps","$ionicSlideBoxDelegate","linkCard","loading",function($scope,location,gps,$ionicSlideBoxDelegate,linkCard,loading)
    {  	    
    $scope.slide=$ionicSlideBoxDelegate;
	$scope.name="nome";	
  	$scope.files=[];
  	$scope.tags=["prova"];
  	$scope.slideHasChanged=function(index)
  		{
  		
  			
  		}
  	$scope.$watchCollection("files",function(data)
  		{
  		var colorThief = new ColorThief();
  		angular.forEach(data,function(item)
  			{  			
  			var img = $("<IMG SRC='"+item.img+"'/>"); 
  			item.color = colorThief.getColor(img[0]);
  			item.palette = colorThief.getPalette(img[0], 4);
  			})
  		})
  	
  	   	
  	$scope.save	=	function()
		{	
  		var tags=[];
  		angular.forEach($scope.tags,function(value)
  			{
  			tags.push(value.text);
  			})
  			
  		var act = this;  	  		
  		var obj = 
  			{  			
  			img			:	$scope.files[0].img,
  			name		:	act.name,
  			position	:	{lat:gps.latitude,lng:gps.longitude},
  			tags 		:	tags,
  			txt			:	act.description,
  			type		:	"ristorante"
  			}
  		
  		loading.show();
  		location.save(obj,function(data)
			{		   			
  			linkCard.add(data.uuid).then(function(data)	
  				{
  				loading.hide();
  				
  				
  				$scope.code = data.data.code;
  				
  				
  				//$state.go("pubs.list");
  				})
  			
			},function(e)
			{		
			alert("KO");
			});  		
		}
  	
  	//$scope.tags= $('#tags').tagging()[0];
  	//$scope.tags.tagging("add","ristorante");  	
    }])
    
    
   .filter('seconds', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])
.filter('br',["$sce",function($sce){
	return function(data){
		if(data==null) return data;		
		return data.replace(/&#10;/g,"<BR/>");
	}
}])
 .filter('resize', [function() {
    return function(url,w,h) {    	
    	if(url==null)				return url;
    	if(url.indexOf("data:")>=0) return url;
    	var dot = (url.indexOf("?")>=0)?"&":"?";
		return url+dot+(w!=null?("w="+w):"")+(w!=null&&h!=null?"&":"")+(h!=null?("h="+h):"");        
    };
}])

.factory("resourceCache",["$resource",function($resource){
	
	var query=function(data,callback,error)
		{
		var act = this;				
		if(data.shop!=this._shop) this._list=null;
		this._shop=data.shop;
		
		if(callback==null) {callback=data; data={};}
		if(act._list!=null) 			
			return callback(act._list);
			
		console.log("no cache index.list");
		return this.resource.query(data,function(data){			
			act._list=data;		
			callback(data);
			},error);
		};
	var save=function(data,callback){
		var newItem=true;
		var act = this;
		if(data.id!=null)
			angular.forEach(this._list,function(item,index){			
				if(item.id==data.id) 				
					{				
					act._list[index]=data;
					newItem=false;
					}
			});
		
		if(newItem)
			{ 
			data.detail=true;
			if(data.id==null)	data.id=""+Math.random();
			if(this._list==null) this._list=[];
			this._list.push(data);		
			}
	console.log(this._list);
	}
	var get = function(data,callback,error)
		{			
		var found=false;
		var act = this;			
		//if(error==null) error=function(){}
		if(error==null) error=callback;
		var foundList = function(list,data){	
			var result=null;
    		angular.forEach(list,function(item)	{
    			if(item.id==data.id)    				
    				result=item;    				
    			})	
    		return result;    	
			}
		var replace = function(list,data){	
			var result=null;
    		angular.forEach(list,function(item,index)	{    			
    			if(item.id==data.id)    				
    				list[index]=data;			
    			})	    		    	
			}
		
		if(this._list!=null)
			{
			var item = foundList(this._list,data);
			if(item!=null && item.detail)
				{
				if(item!=null) callback(item);
				else		   error();
				return;
				}
			}
			
		return this.resource.get(data,function(dt)
				{			
				dt.detail=true;
				replace(act._list,dt);
				callback(dt);
				},function()	
				{
				var qry={};
				for(var i in data) if(i!="id") qry[i]=data[i];
				
				act.query(qry,function(list)	
					{					
					var item = foundList(list,data);					
					if(item!=null) {item.detail=true; callback(item);}
					else		   error();
					},function(){error();})
				})
	};
	
	var result =function(data,params,cache)
		{
		return {
			url:data,
			cache:cache,
			query:query,
			get:get,
			save:save,
			resource:$resource(data,params)
			};
		};
	return result;	
}])

     .controller("audioController",["$scope",function($scope)
			{
		 	console.log("audioController");
		 	$scope.list=[];	
		 	$scope.add=function()
		 		{
		 		console.log("add");
		 		window.plugins.AudioPicker.getAudio(function(data)
				 	{	
		 			//$scope.list.push({albumTitle:"prova",duration:100});
		 			console.log(data);
		 			for(i in data)		 				
		 				$scope.list.push(data[i]);
		 				
		 			$scope.$apply();
			 		},function(){},true,false);	
		 		}
		 		 			 		
			}])
			
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
})


.factory("injectCSS", ['$q', '$http', function($q, $http){
	  var injectCSS = {};
	  
	  var createLink = function(id, url) {
	    var link = document.createElement('link');
	    link.id = id;
	    link.rel = "stylesheet";
	    link.type = "text/css";
	    link.href = url;
	    return link;
	  }
	  
	    
	  injectCSS.set = function(id, url){
	    var link;
	    if(!angular.element('link#' + id).length) {
	      link = createLink(id, url);
	      link.onload = deferred.resolve;
	      angular.element('head').append(link);
	    } else {
	    	angular.element('link#' + id).attr("href",url)
	    }
	    	    
	  };
	  
	  return injectCSS;
	}])
.controller("whoareController",["$scope","upload",function($scope,upload){
	if($scope.shop.whoarewe==null) $scope.shop.whoarewe={gallery:[]};
	$scope.addImage=function(){
		upload.upload().then(null,null,function(e){
			if($scope.shop.whoarewe==null)
				$scope.shop.whoarewe={};
			if($scope.shop.whoarewe.gallery==null)
				$scope.shop.whoarewe.gallery=[];
			$scope.shop.whoarewe.gallery.push({src:e});
			})
		}
	
	}])
.directive('hideFooter', function($rootScope) {	
  return {
    restrict: 'A',
    link: function($scope, $el) {    	
      $scope.$on("$ionicView.Enter", function () {
        $rootScope.showFooter = false;
      });      
    }
  };
})
.directive('showFooter', function($rootScope) {	
  return {
    restrict: 'A',
    link: function($scope, $el) {    	
      $scope.$on("$ionicView.afterEnter", function () {    	  
        $rootScope.showFooter = true;
        $el.find("ion-content").addClass("has-footer");        
      });
      $scope.$on("$ionicView.leave", function () {  
        $rootScope.showFooter = false;
        $el.find("ion-content").removeClass("has-footer");
      });
    }
  };
})
.factory("toBase64",function()
	{
	return function(url, callback, outputFormat){

        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null; 
        };
        img.src = url;
		}; 
	})
.directive('autoFocus',["$timeout", function($timeout) {
  return {	
    restrict: 'A',    
    link: function(scope, el, attrs) {    	
    	scope.$root.$on('$ionicView.afterEnter', function() {    	  
    	//el[0].focus();        
      });
    }
  };
}])
.config(['ngToastProvider', function(ngToastProvider) {
  ngToastProvider.configure({
    animation: 'slide', // or 'fade'
    horizontalPosition:'center'
  });
}])
.directive('presentationBar',[function() {
   return {
	  retrict :'E',
	  //require:["title","icon"],
	  replace:true,
	  scope:{
		background:	"@",
		title	:	"@",
		text	:	"@",
		icon	:	"@",
		onClose	:	"@",
		onCloseClick	:	"@",
		onSave  :	"@",
		onSaveClick	:	"@"
	  	},
	  controller:function($scope,$state)
	  	{		
		 $scope.save=function(){			 
			eval("$scope.$parent."+$scope.onSaveClick);			
			}
		 $scope.close=function(){
			eval("$scope.$parent."+$scope.onCloseClick);
		 	}
	  	},
	  template: '<div class="presentation-bar">'+	  
				'<div class="text-box">'+
				'<div ng-if="onClose" class="close ion-close-circled" ui-sref="{{onClose}}"></div>'+
				'<div ng-if="onCloseClick" class="close ion-close-circled" ng-click="close()"></div>'+
				'<div ng-if="onSave" class="save close ion-checkmark-circled" ui-sref="{{onSave}}"></div>'+
				'<div ng-if="onSaveClick" class="save close ion-checkmark-circled" ng-click="save()"></div>'+
				'	<h2>{{title}}</h2>'+
				'	<i class="icon {{icon}}"></i>'+
				'	<P ng-bind-html="text"></P>'+
				'</div>'+
				'<div ng-if="!background" class="curtain"></div>'+
				'<div ng-if="background" class="background" style="background-image: url(\'{{background|resize:1080:750}}\');"></div>'+
				'</div>'
				
   	};
   }]);

function handleOpenURL(url) 
	{
    var body = document.getElementsByTagName("body")[0];    
    var mainController = angular.element(body).scope();
    	mainController.launch(url);
	}

String.prototype.hashCode = function() {
	  var hash = 0, i, chr, len;
	  if (this.length == 0) return hash;
	  for (i = 0, len = this.length; i < len; i++) {
	    chr   = this.charCodeAt(i);
	    hash  = ((hash << 5) - hash) + chr;
	    hash |= 0; // Convert to 32bit integer
	  }
	  return hash;
	};
  