angular.module("ngBase",["ngResource",                          
                         "tmh.dynamicLocale",
                         "pascalprecht.translate"])
.config(["$translateProvider","tmhDynamicLocaleProvider",function($translateProvider,tmhDynamicLocaleProvider) {	 
	tmhDynamicLocaleProvider.localeLocationPattern('/lib/angular-i18n/angular-locale_{{locale}}.js');
    $translateProvider.useStaticFilesLoader({prefix: 'i18n/locale-',suffix: '.json'});
	}])
.factory("countries",["config","$http",function(config,$http)
	{
	var coun=null;
	return {
		query:function(callback)
			{
			if(coun!=null) return callback(coun);
			$http({url:config.countries.url,method:"get"}).then(function(data)
				{
				coun=[];
				angular.forEach(data.data.countries,function(item,key)
					{					
					item.code=key;
					coun.push(item);					
					});				
				callback(coun);
				})
			},
		get:function(data,callback){
			
			this.query(function(cnts){
				cnts.some(function(item){
					if(item.name==data.name)
						{
						callback(item);
						return true;
						}
					})
				})			
			}
		}
	}])
.directive('cache', ["base64",function (base64) 
    {
    return {      
      restrict: 'A',
      link:function(scope, iElm, iAttrs)
      	{    	
    	var src = scope.$eval(iAttrs.src);
    	iAttrs.$set('src',src);    	
    	if(src.substring(0,5)=="data:") return;
    	console.log("img");
    	iAttrs.$set('src',"");
    	base64.convert(src).then(function(data)
    		{
    		iAttrs.$set('src',data);
    		scope.item.img=data;
    		})    	
      	},      
    };
  	}])
.directive('sbLoad', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var fn = $parse(attrs.sbLoad);
        elem.on('load', function (event) {
          scope.$apply(function() {
            fn(scope, { $event: event });
          });
        });
      }
    };
  }])
.directive('focusOn', function ($timeout) 
	{	
    return {
        link: function(scope, element, attrs) 
        	{           	
            scope.$watch(attrs.focusOn, function(newValue)
            	{            	                        	
                if (newValue) 
                	{
                    //$timeout(function(){$(element).focus();});                    
                	}
            	});
        	}
     	};
	})
 .directive('ngBkg', function () {
        return {
        	link:function (scope, element, attrs) {
        
        	attrs.$observe('ngBkg', function(value) {
        		element.css({
                    'background-image': 'url(' + attrs.ngBkg + ')',
                        'background-size': 'cover',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center'
                });
    		});
            
        	}
        };
    })
.value("config",
	{
	name:"inPub",
	urls:
		{
		configuration:"http://95.110.224.34:8080/relay-service-web/rest/land/config/:id",
		community:"",		
		},
	data:{}
	})
.factory("configurations",["$resource","config",function($resource,config)
   {
   return $resource(config.urls.configuration,{id:'@id'})
   }])
.service("loading",["$ionicLoading","$rootScope",function($ionicLoading,$rootScope)
    {
	this.hide=function()
		{
		$ionicLoading.hide();
		}
	this.show=function()
		{				
		$rootScope.loader={info:""};
		$ionicLoading.show();
		}
    }])
.service("popup",["$ionicPopup",function($ionicPopup)
	{
	this.open=false;
	this.confirm=function(title,msg,ok,ko)
		{
		$ionicPopup.confirm({title:title,template:msg}).then(function(res){if(res) if(ok)ok(); else if(ko)ko();})
		}
	this.alert=function(title,msg)
		{
		var act = this;
		
		if(this.open==true) return;
		this.open=true;
		$ionicPopup.alert({title:title,template:msg}).then(function(){act.open=false;});;
		}
	this.show=function(title,msg,buttons)
		{				
		$ionicPopup.alert({title:title,template:msg,buttons:buttons})
		}
	this.prompt=function(title,msg,placeholder,ok)
		{				
		$ionicPopup.prompt({title:title,template:msg,inputType:'text',inputPlaceholder: placeholder}).then(ok)
		}
	}])
.service("base64",["$q",function($q)
   {
	this.convert=function(url)
		{
		var deferred = $q.defer();
		var canvas = document.createElement('CANVAS'),
	        ctx = canvas.getContext('2d'),
	        img = new Image();
		img.crossOrigin = 'Anonymous';
	    img.onload = function()
	    	{
	        var dataURL;
	        canvas.height = img.height;
	        canvas.width = img.width;
	        ctx.drawImage(img, 0, 0);
	        dataURL = canvas.toDataURL("image/jpeg", .8);
	        deferred.resolve(dataURL);
	        canvas = null; 
	    	};
	    img.src = url;
		
		return deferred.promise;
		}	
   }])
.service("upload",["$q",function($q)
    {
	var act=this;
	this.input=null;
	
	this.upload=function(w,h)
		{		
		console.log("upload");
		var deferred = $q.defer();
		
		var form = $("<FORM/>",{style:"position:absolute;z-index:200",id:'shot',action:""});
		var file = $("<INPUT/>",{type:"file",name:"xx"});			
			form.append(file);			
			$("BODY").append(form);
			form.hide();
		act.input=file;
		
		act.input.click();		
		act.input.change(function(e)
			{
			var files= e.target.files;
			form.remove();
			angular.forEach(files,function(file)
				{				
				var reader = new FileReader();
				reader.onload = function(e) 	
					{								
					deferred.notify(reader.result);
					}				
				reader.readAsDataURL(file);
				})
			})
		return deferred.promise;
		}
    }])
    
.config(["$httpProvider",function($httpProvider,$q){
	var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

	function convertDateStringsToDates(input) {
	    // Ignore things that aren't objects.		
		
	    if (typeof input !== "object") return input;

	    for (var key in input) {
	        if (!input.hasOwnProperty(key)) continue;

	        var value = input[key];
	        var match;
	        
	        // Check for string properties which look like dates.	        
	        if (typeof value === "string" && (match = value.match(regexIso8601))) {
	        	
	            var milliseconds = Date.parse(match[0])
	            if (!isNaN(milliseconds)) {
	                input[key] = new Date(milliseconds);	                
	            }
	        } else if (typeof value === "object") {
	            // Recurse into object
	            convertDateStringsToDates(value);
	        }
	    }
	}
		
	$httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    	});
	
	 $httpProvider.interceptors.push(function($rootScope,$q) {
		 var open=0;
         return  {        	 	 
                 request: function(request) {          
                	 request.headers["access-token"]=localStorage.getItem("jwt");
                	 
                	 $rootScope.$broadcast('loading:show')
                	 open++;                	 
                     return request;
                 },	
                 response: function(response) {       
                	 open--;
                	 if(open<=0)	$rootScope.$broadcast('loading:hide')                	                 	 
                     return response;
                 },
                 requestError: function(response) {
                	 open--;
                	 if(open<=0)	$rootScope.$broadcast('loading:hide')
                     return $q.reject(response);
                 }, 
                responseError: function(response) {
                	open--;
                    if(open==0)$rootScope.$broadcast('loading:hide')                                    	
                    return $q.reject(response);
               }
         }
	 })
}])
.factory("currency",["$locale",function($locale){
	return {
		code:function()
			{
			var sym = $locale.NUMBER_FORMATS.CURRENCY_SYM;			
			if(sym=="$") return "USD";
			if(sym=="\u20ac") return "EUR";			
			}
	}
}])

.directive('ngCache', function() {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {

                attrs.$observe('ngSrc', function(src) {
                    ImgCache.isCached(src, function(path, success) {
                    	console.log(path);
                        if (success) {
                        	console.log("cache!!");
                            ImgCache.useCachedFile(el);
                        } else {
                        	console.log("no cache..."+src);
                            ImgCache.cacheFile(src, function() {
                                ImgCache.useCachedFile(el);
                            });
                        }
                    });

                });
            }
        };
    })
.run(["loading","$rootScope","configurations","config","tmhDynamicLocale","$translate","$ionicPlatform",function(loading,$rootScope,configurations,config,tmhDynamicLocale,$translate,$ionicPlatform)
   {		
	$rootScope.$on('loading:show', function() {
        loading.show();        
		})
   
   $rootScope.$on('loading:hide', function() {
        loading.hide();
   		})
	
  
   console.log("configurations....");   
   configurations.get({id:config.name},function(data)
		   {
	   		console.log("...configurations OK");
	   		if(data.attributes!=null)
	   			if(data.attributes instanceof Object)
	   				config["data"]=data.attributes;
	   			else
	   				config["data"]=JSON.parse(data.attributes);	   			
	   		})
	$ionicPlatform.ready(function() {
		tmhDynamicLocale.set("it-it");
		 $translate.use("it");
		
        if(typeof navigator.globalization !== "undefined") {
        	tmhDynamicLocale.set("it-it");
            navigator.globalization.getLocaleName(function(language) {            	
            	
                $translate.use((language.value).split("-")[0]).then(function(data) {
                    console.log("SUCCESS -> " + data);
                }, function(error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        	}
		});
   }]);  