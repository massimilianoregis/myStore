angular.module("ngIndex.base",[])
.value("config",
		{				
		shop:
			{
			base:""			
			}			
		})
//community
.factory("user",function()					{return user;})
.factory("community",function()				{return community;})
		

//base
.factory("paypal",function()				{return paypal;})
.factory("upload",function()				{console.log("upload");})
.factory("popup",function()					{return popup;})

//ionic
.factory("$cordovaTouchID",function()		{return touchid;})
.service("$ionicActionSheet",function()		{return actionSheet;})
.factory("$ionicModal",["$q",function($q)	{return $ionicModal}])
.factory("$ionicHistory",function()			{return history;})
.factory("$ionicSideMenuDelegate",function(){return sidemenu;})
.factory("$cordovaSocialSharing",function()	{return $cordovaSocialSharing;})

var upload={
	upload:function(){
		
		}
};

var community={
	sendMessage:function(message){}
};

var user={
	firstName:null,
	lastName:null,
	mail:null
};

var paypal={
	pay:function(code,ordine,total,callback){
		callback();
	}
};

var sidemenu={
	toggleRight:function(){},
	toggleLeft:function(){}
};

var history={
	nextViewOptions:function(){}
};

var touchid={
	authenticate:function(txt)	{
		return popup.confirm(txt);
		}
};

var popoup={
	show:function(){
		alert("show alert");
	}
};

var actionSheet={
	show:function(opt)	{
		alert("show action sheet")
	}
};

var $ionicModal ={
	fromTemplateUrl:function() {
		var deferred=$q.defer();
		deferred.resolve({
			show:function(){alert("show modal");},
			hide:function(){alert("show hide");}
			});
		return deferred.promise;
		}
	};
	

var $cordovaSocialSharing={
	share:function()
		{
		alert("social sharing")
		}
};