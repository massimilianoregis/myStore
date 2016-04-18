angular.module('app')
.config(["$stateProvider","$urlRouterProvider","$provide",function($stateProvider,$urlRouterProvider,$provide) {
	
	$stateProvider
	.state('pub',{		
		url: "/pub/{shop}",
		views:{
	    	'': {
	    		templateUrl: "views/single/layout.html",
	    		controller:"shopController"
	    		},
			'sx@pub': {
	    		templateUrl: 'views/single/menu/sx.html',
	    		controller:"indexGroupsController"
    			},
	    	}				
		})
		
	.state('pub.home', {
	    url: "/home",	  	    
	    templateUrl: "views/single/chisiamo.html",
	    controller:"newsController",
	    cache:false
	    })	
	.state('pub.goods', {
	    url: "/goods/{group}",	  	    
	    templateUrl: "views/single/goods/listCols.html",
	    cache:false,
	    controller:"indexController"
	    })	
	.state('pub.item', 
		{
		url: "/item/{id}/{name}",			
		views:{
	    	'@pub':{
	    		templateUrl: "views/single/goods/base.html",
	    		controller:"indexSingleController"		    		
	    		}
	    	}
		})		
	.state('pub.wish', {
	    url: "/wish",	  	    
	    templateUrl: "views/single/wish.html",
	    controller:"wishController"
	    })	
    .state('pub.map', {
	    url: "/map",	  	    
	    templateUrl: "views/single/map/base.html",
	    controller:"mapController"
	    })
	 .state('pub.plan', {
	    url: "/plan",	  	    
	    templateUrl: "views/single/map/plan.html",
	    controller:"planController"
	    })
    .state('pub.chisiamo', {
	    url: "/chisiamo",	  	    
	    templateUrl: "views/single/chisiamo.html"
	    })	
	
	
	.state('pub.orders', {
	    url: "/orders",	  	    
	    templateUrl: "views/single/orders/list.html",
	    controller:"ordersController"
	    })
	.state('pub.order', {
	    url: "/order/{id}",	    
	    templateUrl: "views/single/orders/single.html",
	    controller:"orderController"
	    })
	    
	
	.state('pub.blog', {
		    url: "/blog",	  	    		    
		    templateUrl:"views/single/blog/layout.html"
		    })	
	.state('pub.blog.list', {
		    url: "/list",	  	    
		    templateUrl: "views/single/blog/list.html",
		    controller:"newsController"
		    })
		    
	.state('pub.offers', {
		    url: "/blog",	  	    		    
		    templateUrl:"views/single/blog/layoutOffers.html"
		    })	
	.state('pub.offers.list', {
		    url: "/offers",	  	    
		    templateUrl: "views/single/blog/list.html",
		    controller:"newsController"
		    })
		    
	.state('pub.messages', {
		    url: "/messages",	
		    
		    template: "<ui-view></ui-view>",		    
		    })
	.state('pub.messages.list', {
		    url: "/list",	  	    
		    views:{
		    	'@pub':{
		    		templateUrl: "views/single/messages/list.html",
		    		}
		    	}		    		    
		    })
	.state('pub.messages.single', {
		    url: "/single",		    
		    views:{
		    	'@pub':{
		    		templateUrl: "views/single/messages/single.html",
		    		controller:"messageController",		    		
		    		}
		    	},
		    	data:	
		    		{
	    			from:"user"    			
	    			}    
		    })
	.state('pub.card',{
		url:"/card",
		
		views:{
	    	'@pub':{
	    		templateUrl: "views/single/card.html",
	    		controller:["$cordovaVibration","$scope",function($cordovaVibration,$scope)
	    		      {
	    			  $scope.click=function(){$cordovaVibration.vibrate(100);}
	    		      }],
	    		}
	    	}	    
		})
	.state('pub.basket', {
	    url: "/basket",	  	    	    
	    cache:false
	    });
	
	//$urlRouterProvider.when('', '/list');
	//$urlRouterProvider.when('', '/pub/id_123');
	
	$urlRouterProvider.when('/', '/walkthrough');	
}])