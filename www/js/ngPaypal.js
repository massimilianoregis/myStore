angular.module("paypal",[])
.controller("paypalEditController",["$ionicModal","$scope",function($ionicModal,$scope){
	if($scope.credential==null)
		{
		$ionicModal.fromTemplateUrl('paypal/credential.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.credential = modal;		    
		  });		
		}	

}])
.factory("paypal",["currency","popup","$ionicPlatform","$rootScope",function(currency,popup,$ionicPlatform,$rootScope)
	{		
	var paypal = {
			init:function(mail, secret){
				var config = new PayPalConfiguration({
		    		merchantName: mail, 
		    		merchantPrivacyPolicyURL: "https://mytestshop.com/policy", 
		    		merchantUserAgreementURL: "https://mytestshop.com/agreement"
		    		});    
		    	var clientIDs = {
				       "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
				       "PayPalEnvironmentSandbox": secret//"AaKu0xmKki7-98v5zdFMb5KDyLfb_p80P6fgxYc_RAEqY5RTvrVVeFcY84qE1XvWvfuUM8RogAFQjbF0"
				     };
		
				PayPalMobile.init(clientIDs, function()
						{
					 	PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", config, function(){});
						});
				},
			pay:function(code,name,price,ok,ko){		
				console.log(code+" "+name+" "+price+" "+currency.code());
				if(window["PayPalMobile"]==null) 
					return popup.confirm("pagamento","Confermi il pagamento di "+price,ok,ko);
				
				var paymentDetails = new PayPalPaymentDetails(price, "0.00", "0.00");
			    var payment = new PayPalPayment(price,currency.code(), name, "Sale", paymentDetails);
			    
			    var items = [new PayPalItem("prova prodotto", 1, price/2,currency.code(), "234rew"),
			                 new PayPalItem("prova prodotto2", 1, price/2,currency.code(), "234rew2")];
			    console.log("----------------------");
			    console.log(payment);
			    console.log("----------------------");
			    payment.items=items;
				PayPalMobile.renderSinglePaymentUI(payment, 
					function(payment) {	
						if(ok) ok(payment);
				     console.log("payment success: " + JSON.stringify(payment, null, 4));
				   },
				   function(payment) {
					   if(ko) ko(payment);
					     console.log("payment cancel: " + JSON.stringify(payment, null, 4));
					   });
				}
		
		};
	return paypal;
	}])
.controller("paypalController",["$scope","$locale","currency",function($scope,$locale,currency){

	var config = new PayPalConfiguration({merchantName: "massimiliano.regis@gmail.com", merchantPrivacyPolicyURL: "https://mytestshop.com/policy", merchantUserAgreementURL: "https://mytestshop.com/agreement"});    
	var clientIDs = {
		       "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
		       "PayPalEnvironmentSandbox": "AaKu0xmKki7-98v5zdFMb5KDyLfb_p80P6fgxYc_RAEqY5RTvrVVeFcY84qE1XvWvfuUM8RogAFQjbF0"
		     };	
	 
	$scope.future=function()
		{
		PayPalMobile.renderFuturePaymentUI(function(payment) {
		     console.log("payment success: " + JSON.stringify(payment, null, 4));
		   },
		   function(payment) {
			     console.log("payment cancel: " + JSON.stringify(payment, null, 4));
			   });	
		}
	$scope.pay=function(code,name,price)
		{		
		console.log(code+" "+name+" "+price+" "+currency.code());
		if(window["PayPalMobile"]==null) return;
		var paymentDetails = new PayPalPaymentDetails(price, "0.00", "0.00");
	    var payment = new PayPalPayment(price,currency.code(), name, "Sale", paymentDetails);
	    //var item = new PayPalItem("prova prodotto", 1, "20.00", "USD", "234rew");
		PayPalMobile.renderSinglePaymentUI(payment, 
			function(payment) {
		     console.log("payment success: " + JSON.stringify(payment, null, 4));
		   },
		   function(payment) {
			     console.log("payment cancel: " + JSON.stringify(payment, null, 4));
			   });
		}
	
	if(window["PayPalMobile"]==null) return;
	PayPalMobile.init(clientIDs, function()
			{
		 	PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", config, function(){});
			});
}]);