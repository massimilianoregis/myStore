angular.module('app')
.config(["$stateProvider","$urlRouterProvider","$provide",function($stateProvider,$urlRouterProvider,$provide) {
	
	$stateProvider
	//<community>
	.state('community',
		{
		url: "/community",
		abstract:true,		
		templateUrl: "views/community/layout.html",	
		})	
	 .state('community.confirm', 
		{			
		url:"/confirm/:mail/:psw",
		templateUrl: "views/community/confirm.html",		
		controller:"confirmController"
		})
	 .state('community.lost', 
		{			
		templateUrl: "views/community/resetPsw.html",
		controller:"lostController"
		})
	  .state('community.login', 
		{			
		url:"/login.html",
		templateUrl: "views/community/login.html",
		controller:"loginController"
		})
	 .state('community.register', 
		{
		url: "/register",
		templateUrl: "views/community/register.html",
		controller:"registerController"
		})
	.state('community.profile', 
		{		
		url:"/profile.html",
		templateUrl: "views/single/community/profile.html",
		controller:"profileController"
		})
	.state('community.welcome',{
		url:"/welcome",		
		templateUrl: "views/community/welcome.html",
		controller:"loginController"
		})
	.state('community.logout',{
		url:"/logout",		
		templateUrl: "views/community/login.html"
		})
	.state('profile', 
		{
		url: "/profile",						
		controller:["user","$scope","$state",function(user,$scope,$state)
			{				
			if(!user.logged) 		$state.go("community.login");
			else				 	$state.go("community.profile");
			}]
		})
	//</community>
		
	.state('pub.profile',{
		url:"/profile",		
		templateUrl: "views/single/community/profile.html",
		controller:"profileController",
		onExit:function(user,community)
			{			
			community.save(user)
			}
		})
	.state('pub.profileAddress',{
		url:"/profile/address",		
		templateUrl: "views/community/addresses.html",
		controller:"profileController"
		})
	.state('pub.profileAddressEdit',{
		url:"/profile/address/edit/{id}",		
		templateUrl: "views/community/addressesEdit.html",
		controller:"addressEditController"
		})
	.state('pub.profileAddressNew',{
		url:"/profile/address/new",		
		templateUrl: "views/community/addressesEdit.html",
		controller:"addressEditController"
		})
}]);