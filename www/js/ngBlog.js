angular.module("ngBlog",["ngBase"])
.config(function($stateProvider) {
	$stateProvider
	.state('blog', {
		    url: "/blog",	  	    
		    abstract:true,
		    template:"<ui-view></ui-view>"
		    })		   
	/*
    .state('blog.list', {
		    url: "/list",	  	    
		    templateUrl: "views/blog/list.html",
		    controller:"lastNews"
		    })*/
	})
.factory("blogItems",function(){
	var items = [
		         {title:"prova",img:{src:"http://lorempixel.com/400/400/city/1"},text:" This is a 'Facebook' styled Card. The header is created from a Thumbnail List item,the content is from a card-body consisting of an image and paragraph text. The footerconsists of tabs, icons aligned left, within the card-footer.", date:new Date()},
		         {title:"prova",img:{src:"http://lorempixel.com/400/400/city/2"},text:"Lorem Ipsum", date:new Date()},
		         {title:"prova",img:{src:"http://lorempixel.com/400/400/city/3"},text:"Lorem Ipsum", date:new Date()}
		         ];
	return {
		query:function(success)
			{
			success(items);
			},
		save:function(data)
			{
			items.push(data);
			}
		};
	})
.controller("blogItemEditController",["$scope","upload","blogItems",function($scope,upload,items){	
	$scope.setImage=function(){		
		upload.upload().then(null,null,function(e)
			{						
			$scope.item.img={src:e};			
			});	
		};
	$scope.save=function(){
		$scope.item.date=new Date();
		items.save($scope.item);
		}
	$scope.item={
		title:"Nuovo",
		text:"",
		img:""
		}
	
	}])
.controller("lastNews",["$scope","$cordovaSocialSharing","blogItems",function($scope,$cordovaSocialSharing,items)
   {
	$scope.share=function(title,text,img,link)
		{
		img="http://www.bestourism.com/img/items/big/1090/Canada_Canada-landscape_5903.jpg";
		console.log("sharing..."+title+","+text+","+img);
		$cordovaSocialSharing
		    .share(title, text,img , link) // Share via native share sheet
		    .then(function(result) {
		      console.log("shared")
		    }, function(err) {
		      // An error occured. Show a message to the user
		    });
		}
	items.query(function(data){
		$scope.list=data;
	})
   
   }])