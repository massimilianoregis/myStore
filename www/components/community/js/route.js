angular.module("ngCommunity")
	.config(["$stateProvider","$httpProvider",function($stateProvider,$httpProvider) 
	{	
	$httpProvider.defaults.headers.common["X-Requested-With"]="valore";
	$stateProvider
	.state('community',
		{
		url: "/community",
		abstract:true,		
		templateUrl: "components/community/views/layout.html",	
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
	 .state('community.confirm', 
		{			
		url:"/confirm/:mail/:psw",
		templateUrl: "views/community/confirm.html",		
		controller:"confirmController"
		})
	 .state('community.lost', 
		{			
		templateUrl: "components/community/views/resetPsw.html",
		controller:"lostController"
		})
	  .state('community.login', 
		{			
		url:"/login.html",
		templateUrl: "components/community/views/login.html",
		controller:"loginController"
		})
	 .state('community.register', 
		{
		url: "/register",
		templateUrl: "components/community/views/register.html",
		controller:"registerController"
		})
	.state('community.profile', 
		{		
		url:"/profile.html",
		templateUrl: "views/community/profile.html",
		controller:"profileController"
		});
	}])