angular.module("ngIndex",[])
.config(["$stateProvider",function($stateProvider)
   {
   $stateProvider
   .state('index',
		{
	    //url: "/index",	    		
		template: '<ui-view/>'
		//templateUrl: "views/pub.html"
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
	    
	.state('index.list',
   		{
   		url:'/index/list.html',
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
		
	.state('basket',
		{
		url:"/views/basket",
		templateUrl: "views/basket/base.html",	
		controller:"basketController"
		})	
   }]);