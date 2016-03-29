angular.module("ngCommunity",["ui.router","ngResource","ngBase","your_app_name.directives","underscore"])
.value("config",
	{
	shop:"main",
	community:
		{
		url:{
			user	:	"http://localhost:8080/community/user/:id",
			login	:	"http://localhost:8080/community/login",
			register:	"http://localhost:8080/community/register",
			sendPsw	:	"http://localhost:8080/community/:mail/sendPsw",
			jwt		:	"http://localhost:8080/community/jwt"
			}
		}
	})
.value("user",
	{
	logged:false,	
	})

.factory("community",["$resource","user","$state","config","$rootScope","$cordovaFacebook","$timeout","countries",
              function($resource,user,$state,config,$rootScope,$cordovaFacebook,$timeout,countries)
	{			
	var loginUser=function(data) {
		var user = loadUser(data);
		$rootScope.$emit("logged");
		return user;
	}
	var loadUser = function(data){		
		if(data==null) 			return data;	
		if(data.mail==null)		data = angular.fromJson(data);
		if(data.mail==null) 	return data;		
		
		angular.extend(user,data);
		angular.extend(user,user.data);
		
		user.canAccess=function(role){
				var access=false;
				angular.forEach(user.roles,function(item){
					if(item.id==role) access=true;
				});
				return access;
			};
		if(user.jwt) localStorage.setItem("jwt", user.jwt);
		user.logged=true;
		
		angular.forEach(user.addresses,function(item){
			countries.get({name:item.country},function(cnt){
				item.area=cnt.continent;
				});	
			})	
		
		if($state.includes("community") || $state.includes("walkthrough"))
			{								
			$state.go("shops.list");
			if( navigator.splashscreen) $timeout(function(){navigator.splashscreen.hide();},200);
			}
		
		return data;
		}
	
	var community = $resource(
			config.community.url.user,{id:"@id"},
			{
			save:
				{
				method:'POST',
				url:config.community.url.user,
				responseType:'json',
				transformResponse:loadUser					
				},
			addUserRole:
				{
				method:'GET',
				isArray:false,
				params:{user:'',role:''},
				url:config.community.url.adduserRole,
				responseType:'json',	
				transformResponse:loadUser					
				},
			removeUserRole:
				{
				method:'GET',
				isArray:false,
				params:{user:'',role:''},
				url:config.community.url.removeuserRole,
				responseType:'json'				
				},
			usersByRole:
				{
				method:'GET',
				isArray:true,
				params:{role:''},
				url:config.community.url.userByRole,
				responseType:'json'				
				},
			get:
				{
				method:'GET',
				params:{mail:''},
				url:config.community.url.single,
				responseType:'json'				
				},
			login:
				{
				method:'GET',
				params:{mail:'',psw:''},
				url:config.community.url.login,
				responseType:'json',
				transformResponse:loginUser
				},
			FBLogin:
				{
				method:'POST',
				url:config.community.url.user,
				responstType:'json',
				transformResponse:loginUser
				},
			register:
				{
				method:'POST',
				url:config.community.url.register,
				responseType:'json'				
				},
			otp:
				{
				method:'GET',
				url:config.community.url.otp,
				params:{id:''},
				responseType:'json',
				transformResponse:loginUser
				},
			sendMessage:
				{
				method:'GET',
				url:config.community.url.sendMsg,
				params:{mail:'',message:''},
				responseType:'json'				
				},
			sendPsw:
				{
				method:'GET',
				url:config.community.url.sendPsw,
				params:{mail:''},
				responseType:'json'
				}
			});
	community.logout=function()
		{
		angular.forEach(user,function(data,key){
			delete user[key];
			})					
		console.log(user);
		user.logged=false;
		user.mail=null;
		localStorage.removeItem("jwt");
		$cordovaFacebook.logout();
		$rootScope.$emit("logout");		
		};
	community.autoLogin=function()
		{	
		console.log("------->autologin<-------");
		var jwt = localStorage.getItem("jwt");
		console.log("JWT:"+jwt);		
		console.log("-------------------------");
		if(jwt==null || jwt=='') {
			if(navigator.splashscreen) navigator.splashscreen.hide();
			return;		
		}		
		$.get(config.community.url.jwt,{jwt:jwt}).then(loginUser,function(){
				if(navigator.splashscreen) navigator.splashscreen.hide();
			});
					
		};
	return community;
	}])
.controller("usersController",["$scope","community",function($scope,community){
	community.query(function(data){
		$scope.list=data;
		})
	}])
.controller("registerController",["$scope","user","$state","community","loading",function($scope,user,$state,community,loading)
    {
	$scope.mail=user.mail;	
	$scope.register=function()
		{	
		var act = this;
		loading.show();
		community.register(
			{
			mail		:	this.mail,
			psw			: 	this.psw,
			first_name	:	this.name,
			last_name	:	this.surname			
			},function()
			{			
			loading.hide();
			$state.go("community.confirm",{mail:act.mail,psw:act.psw})
			});		
		}
	$scope.login=function()
		{		
		$state.go("community.login");
		}
    }])
.controller("lostController",["$scope","$state","user","community",function($scope,$state,user,community)
    {
	$scope.mail=user.mail;
	$scope.lost=function()
		{		
		community.sendPsw({mail:this.mail});
		}
	$scope.register=function()
		{
		$state.go("community.register");
		}
	$scope.login=function()
		{		
		$state.go("community.login");
		}
    }])
.controller("userController",["community","$state","$scope",function(community,$state,$scope)
    {
	var mail = $state.params.mail;
	console.log(mail);
	community.get({mail:mail},function(data)
		{
		$scope.client=data;
		});
    }])
.controller("profileController",["$cordovaFacebook","$scope","$state","user","upload","community","$ionicActionSheet",function($cordovaFacebook,$scope,$state,user,upload,community,$ionicActionSheet)
    {		
	$scope.user=user;
	$scope.changeBackground=function()
		{	
		console.log("change background");
		upload.upload().then(null,null,function(e)
			{
			console.log("image background"+e);
			$scope.user.background=e;
			user.background=e;
			
		
			community.save(user);		
			});		
		}
	$scope.changeAvatar=function()
		{		
		upload.upload().then(null,null,function(e)
			{			
			user.avatar=e;
			$scope.user.img=e;
			if(user.data!=null && user.data.avatar!=null) user.data.avatar=""
			
			community.save(user);			
			});				
		}
	$scope.logout=function()
		{		
		community.logout();
		$state.go("community.welcome");
		}
	$scope.register=function()
		{
		$state.go("community.register");
		}
	$scope.login=function()
		{		
		$state.go("community.login");
		}
	
	
    }])
.controller("confirmController",["$scope","$state","user","community",function($scope,$state,user,community)
    {	
	$scope.confirm=function()
		{				
		community.login({mail:$state.params.mail,psw: $state.params.psw},function(data)
			{			
			$state.go("community.profile")
			});
		}
	$scope.register=function()
		{
		$state.go("community.register");
		}
	$scope.login=function()
		{		
		$state.go("community.login");
		}
    }])
.controller("loginController",["$cordovaFacebook","$scope","$state","user","community","loading",
                       function($cordovaFacebook,$scope,$state,user,community,loading)
	{		
	console.log("-->loginController");
	$scope.mail="";
	$scope.psw="";
	
	$scope.FBlogin=function(){
		console.log("-->login FB");
		loading.show();		  
		$cordovaFacebook.login(["public_profile", "email", "user_friends"])
		    .then(function(success) {
		    	console.log("-->logged: ");
		    	console.log(success);
		    	
		    	$cordovaFacebook.api("me", ["public_profile"])
		        .then(function(success) {
		          console.log("-->FB me data: ");
		          console.log(success);
		          community.FBLogin(
		      			{
		      			mail:success.email,		      			
		      			firstName:success.first_name,
		      			lastName:success.last_name,
		      			avatar:"http://graph.facebook.com/"+success.id+"/picture?type=large"
		      			},function(data)
		      			{		
		      			console.log("save to server");
		      			console.log(data);
		      			user.avatar="http://graph.facebook.com/"+success.id+"/picture?type=large";
		      			$state.go("shops.list");
		      			loading.hide();		      			
		      			});	
		          
		        }, function (error) {
		          // error
		        });
		    	
		    }, function (error) {
	
		    });
	
		}
	$scope.lost=function()
		{		
		user.mail=$scope.mail;
		$state.go("^.lost")
		}
	$scope.register=function()
		{
		user.mail=$scope.mail;
		$state.go("^.register")
		}
	$scope.login=function()
		{		
		loading.show();
		console.log("login..."+this.mail+" "+this.psw)
		$scope.loginSuccess=null;
		community.login({mail:this.mail,psw: this.psw},function(data)
			{						
			if(data.msg==="sent mail")				
				return $state.go("community.confirm",{mail:this.mail,psw:this.psw});				
				
			if(!data.mail) 
				{
				$scope.loginSuccess=false;
				return;
				}
			$scope.loginSuccess=true;
			console.log("login OK");
			loading.hide();
			$state.go("shops.list");
			},function(data)
			{				
			console.log("login KO")
			loading.hide();
			});		
		}
	console.log("<--loginController");
	}])
.run(["community","$rootScope",function(community,$rootScope)
    {		
	
    }])

    
.controller("addressEditController",["countries","$scope","$state","user","community","$ionicNavBarDelegate",function(countries,$scope,$state,user,community,$ionicNavBarDelegate)
    {
	var id 		= $state.params.id
	countries.query(function(data){
		$scope.countries=data
		if(id!=null)
			angular.forEach(data,function(item){
				if(user.addresses[id].country==item.name)
					$scope.country=item;
			})
		});
	$scope.address	={};
	$scope.type		={home:false,work:false};
	if(id!=null)
		{		
		var address	=user.addresses[id];		
		$scope.type		={
					home:address.type=='home',
					work:address.type=='work'
					};
		angular.extend($scope.address,address);		
		}
	$scope.countryChange=function(a)
		{		
		$scope.address.area		= $scope.$$childHead.country.continent;
		$scope.address.country	= $scope.$$childHead.country.name;
		}
	$scope.save = function()
		{
		if(user.addresses==null) user.addresses=[];
		if(id!=null)
			user.addresses[id]=$scope.address;
		else
			user.addresses.push($scope.address);
		//if($scope.type.work)	$scope.address.type ='work';
		//if($scope.type.home)	$scope.address.type ='home';
		community.save(user);
		$ionicNavBarDelegate.back();
		}	
    }])
	/*
.directive('equals', function() {
	  return {
	    restrict: 'A', // only activate on element attribute
	    require: '?ngModel', // get a hold of NgModelController
	    link: function(scope, elem, attrs, ngModel) {
	      if(!ngModel) return; // do nothing if no ng-model

	      // watch own value and re-validate on change
	      scope.$watch(attrs.ngModel, function() {
	        validate();
	      });

	      // observe the other value and re-validate on change
	      attrs.$observe('equals', function (val) {
	        validate();
	      });

	      var validate = function() {
	        // values
	        var val1 = ngModel.$viewValue;
	        var val2 = attrs.equals;
	        // set validity
	        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
	      };
	    }
	  }
	});*/
