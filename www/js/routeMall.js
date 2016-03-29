angular.module('app')
.config(["$stateProvider","$urlRouterProvider","$provide",function($stateProvider,$urlRouterProvider,$provide) {
	
	$stateProvider
	.state('shops',{						
		views:{
	    	'': {
	    		templateUrl: "views/shops/layout.html"
	    		},
			'sx@shops': {
	    		templateUrl: 'views/shops/menu/sx.html',
	    		controller: "listaNegoziUserController"
    			},
	    	}
		})
	.state('shops.list', {
	    url: "/list",	  	    
	    controller:"shopListController",
	    templateUrl: "views/shops/list.html"	    
	    })
	 .state('shops.profile',{
		url:"/profile",		
		templateUrl: "views/community/profile.html",
		controller:"profileController"
		})
	.state('shops.wishShop',{
		url:"/wishShop",		
		templateUrl: "views/shops/wish.html",
	    controller:"shopWishController"
		})
	.state('shops.wish',{
		url:"/wish",		
		templateUrl: "views/single/wish.html",
	    controller:"wishController"
		})
	.state('shops.orders', {
	    url: "/orders",	  	    
	    templateUrl: "views/single/orders/list.html",
	    controller:"ordersController"
	    })
	//<nuovo negozio>	
	.state('shop',
		{
		url:"/shop",		
		templateUrl:"views/admin/shop/layout.html",
		controller:"shopController"
		})
	.state('newshop',
		{
		url:"/shop",		
		templateUrl:"views/admin/shop/FBimport.html",
		controller:"newShopController"
		})		

/*
	.state('shop.gallery',
		{
		url:"/gallery",
		templateUrl:"views/admin/shop/gallery.html",
		controller:function($scope, $cordovaKeyboard){			 
			$scope.$on("$ionicView.afterEnter",function()
				{
				$cordovaKeyboard.close();
				$scope.addImage();
				});
			}
		})
	.state('shop.currencies',
		{
		url:"/currencies",
		templateUrl:"views/admin/shop/currency.html"
		})
	.state('shop.colors',
		{
		url:"/colors",
		controller:"templateController",
		templateUrl:"views/admin/shop/colors.html"
		})
	.state('shop.end',
		{
		url:"/end",		
		templateUrl:"views/admin/shop/end.html"
		})*/
	//</nuovo negozio>
	//<nuovo prodotto>
	.state('pub.admin.good.shoe',{		
		url: "/shoe/{id}",		
		views:{	    	
			'@pub': {
				templateUrl:"views/admin/prodotti/shoe.html",
				controller:"indexSingleEditController"
	    		}			
	    	}			
		})
	.state('pub.admin.good.item',{		
		url: "/item/{id}",		
		cache:false,
		views:{	    	
			'@pub': {				
				templateUrl:"views/admin/prodotti/generic.html",
				controller:"indexSingleEditController"
	    		}			
	    	}			
		})
	.state('pub.admin.good.picture',{		
		url: "/picture/{id}",		
		cache:false,
		views:{	    	
			'@pub': {				
				templateUrl:"views/admin/prodotti/picture.html",
				controller:"indexSingleEditController"
	    		}			
	    	}			
		})
		/*
	.state('pub.admin.good.item.categorie',{		
		url: "/categorie",
		views:{	    	
			'@pub.admin.good.item': {
	    		templateUrl: 'views/admin/prodotti/categorie.html'
    			},
	    	}		
		})
	.state('pub.admin.good.item.warehouse',
		{
		url:"/warehouse",
		templateUrl:"views/admin/prodotti/magazzino.html",
		
		})
	.state('pub.admin.good.item.gallery',{		
		url: "/gallery",
		views:{	    	
			'@pub.admin.good.item': {
	    		templateUrl: 'views/admin/prodotti/gallery.html',	    		
    			},
	    	}
		})
	.state('pub.admin.good.item.prezzi',{		
		url: "/prezzi",
		views:{	    	
			'@pub.admin.good.item': {
	    		templateUrl: 'views/admin/prodotti/prezzi.html'
    			},
	    	}
		})
	.state('pub.admin.good.item.audio',{		
		url: "/audio",
		views:{	    	
			'@pub.admin.good.item': {
	    		templateUrl: 'views/admin/prodotti/audio.html',
	    		controller:'audioController'
    			},
	    	}
		})
	.state('pub.admin.good.item.descrizione',{		
		url: "/descrizione",
		views:{	    	
			'@pub.admin.good.item': {
	    		templateUrl: 'views/admin/prodotti/descrizione.html'	    		
    			},
	    	}
		})*/
	//</nuovo prodotto>
	//<admin>		
		 .state('pub.admin.messages', {
		    url: "/messages",
		    views:{
		    	'@pub':{
		    		templateUrl: "views/admin/messages/list.html",
		    		}
		    	}
		    		    
		    })  
	.state('pub.admin',{		
		url: "/admin",		
		views:{	    	
			'sx@pub': {
	    		templateUrl: 'views/admin/menu/sx.html'
	    	}	   
		}
		})
	
	.state('pub.admin.settings',{		
		url: "/settings",
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/settings.html'	    		
    			},
	    	}		
		})
	.state('pub.admin.address',{		
		url: "/address",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/addresses.html'	    		
    			},
	    	}
		})	
	.state('pub.admin.address.edit',{		
		url: "/edit/address",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/addressesEdit.html'	    	
    			},
	    	}
		})
	.state('pub.admin.shipping',{		
		url: "/shipping",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/shipping.html'	    	
    			},
	    	}
		})
	.state('pub.admin.legal',{		
		url: "/legal",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/legal.html'	    	
    			},
	    	}
		})
	.state('pub.admin.paypal',{		
		url: "/paypal",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/paypal.html'	    	
    			},
	    	}
		})
	.state('pub.admin.whoare',{		
		url: "/whoare",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/chisiamo.html',
	    		controller: 'whoareController'
    			},
	    	}
		})	
	.state('pub.admin.contacts',{		
		url: "/contact",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/settings/contacts.html',	    	
    			},
	    	}
		})	
	.state('pub.admin.whoare.description',{		
		url: "/description",
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/whoare/description.html'
    			},
	    	}
		})
	
	.state('pub.admin.users.single.messages', {
		    url: "/chat",		  
    		templateUrl: "views/admin/messages/single.html",
    		controller:"messageController",    		
    		data:
    			{
    			from:"shop",    			
    			}
		    })
	.state('pub.admin.users.single',{
		url: "/user/{mail}",
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/layout.html',
	    		controller: 'userController'	
    			}
	    	}
		})
	.state('pub.admin.users.single.sheet',{		
		url: "/sheet",				
		templateUrl: 'views/admin/users/user.html'			
		})
	.state('pub.admin.users',{		
		url: "/users"
		})
	.state('pub.admin.users.list',{		
		url: "/list",
		cache:false,
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/users/list.html',
	    		controller: 'shopUsersController'
    			},
	    	}
		})
		
	
	.state('pub.admin.orders',{		
		url: "/orders"
		})
	.state('pub.admin.orders.list',{		
		url: "/list",
		cache:false,
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/orders/list.html',
	    		controller: 'ordersAdminController'
    			},
	    	}
		})
	.state('pub.admin.orders.item',{		
		url: "/item/{id}",
		cache:false,
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/orders/single.html',
	    		controller: 'orderController'
    			},
	    	}
		})
		
	.state('pub.admin.news',{		
		url: "/news"
		})
	.state('pub.admin.news.list',{		
		url: "/list",
		cache:false,
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/news/list.html',
	    		controller:"newsController"
    			},
	    	}
		})
	.state('pub.admin.news.new',{		
		url: "/new",
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/news/base.html',
	    		controller:'newsItemController'
    			},
	    	}
		})
	.state('pub.admin.good',{		
		url: "/good"
		})
	.state('pub.admin.good.list',{		
		url: "/list",		
		views:{	    	
			'@pub': {
	    		templateUrl: 'views/admin/prodotti/list.html',
	    		controller:'indexController'
    			},
	    	},
		cache:false
		})
	//</admin>
	//
		.state('pubs.maps', {
	    url: "/pubs/map",	  	    
	    controller:"pubMapController",
	    templateUrl: "views/pub/map.html"	    
	    })
	.state('pubs.shot',{
		url:"/shot",
		controller:"shotController",
		templateUrl: "views/admin/shot.html"
		})
}]);