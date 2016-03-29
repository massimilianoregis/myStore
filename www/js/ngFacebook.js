angular.module("ngFacebook",[])
.factory("ngFB",function(){
	return{
		login:function(){
			$cordovaFacebook.login(["public_profile", "email", "user_friends","publish_actions","manage_pages"])
		    .then(function(success) {
		    	alert(success);
		    })
		},
		me:function(){
			$cordovaFacebook.api("me", ["public_profile"])
	        .then(function(success) {
	        	alert(success);
	        });
		}
		getPageData:function(id){
			$cordovaFacebook.api(id, ["public_profile","manage_pages"])
	        .then(function(success) {
	        	alert(success);
	        });
		},
		getPages:function(){
			$cordovaFacebook.api("me/accounts?fields=name,access_token,link,picture{url},cover,phone,category,emails,genre,description,contact_address,location,website", ["public_profile","manage_pages"])
	        .then(function(success) {
	        	alert(success);
	        	
	        });
		}
	}
});