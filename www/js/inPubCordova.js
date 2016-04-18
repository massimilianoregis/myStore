angular.module("inpubCordova",["inpub","ngCordova","paypal","ionic"])

.service("upload",["base64","$q","$ionicActionSheet","$cordovaImagePicker","$cordovaCamera",function(base64,$q,$ionicActionSheet,$cordovaImagePicker,$cordovaCamera)
    {
	this.upload=function(w,h)
		{
		var deferred = $q.defer();
		console.log("upload cordova 3");
		
		var hideSheet = $ionicActionSheet.show({
		     buttons: [
		       { text: 'Camera' },
		       { text: 'Gallery' }
		     ],		     
		     titleText: 'Choice a picture',
		     cancelText: 'Cancel',
		     cancel: function() {
		          // add cancel code..
		        },
		     buttonClicked: function(index) {
		    	 
		       if(index==0) camera(); 
		       if(index==1) gallery(); 
		       return true;
		     }
		   });
		/*
		var aviary=function(imageURI)
			{
			 var tools = cordova.plugins.Aviary.Tools;
			 
		        cordova.plugins.Aviary.show({
		            imageURI: imageURI,
		            outputFormat: cordova.plugins.Aviary.OutputFormat.JPEG,
		            quality: 90,
		            toolList: [
		                tools.CROP, tools.ENHANCE, tools.EFFECTS
		            ],
		            hideExitUnsaveConfirmation: false,
		            enableEffectsPacks: true,
		            enableFramesPacks: true,
		            enableStickersPacks: true,
		            disableVibration: false,
		            folderName: "MyApp",
		            success: function (result) {
		                var editedImageFileName = result.name;
		                var editedImageURI = result.src;
		                alert("File name: " + editedImageFileName + ", Image URI: " + editedImageURI);
		            },
		            error: function (message) {
		                alert(message);
		            }
		        });
			}*/
		var camera=function()
			{			
		    var options 	= 
		    	{
		        quality 			: 85,
	    	    destinationType 	: Camera.DestinationType.DATA_URL,
	        	sourceType 			: Camera.PictureSourceType.CAMERA,
		        allowEdit 			: true,
	    	    encodingType		: Camera.EncodingType.JPEG,
	    	    popoverOptions		: CameraPopoverOptions,
		        saveToPhotoAlbum	: false,
		        correctOrientation	: true,
		        cameraDirection		: navigator.camera.Direction.BACK
	    		};
		    if(w) options.targetWidth=w;
		    if(h) options.targetHeight=h;
	    	$cordovaCamera.getPicture(options).then(function(imageData) 
	    		{
			    var img =  "data:image/jpeg;base64," + imageData;
			    //aviary(img);
			    deferred.notify(img);    		    
	    		}, function(err) 
	    		{
	    		
	    		});
			}
    	
		var gallery=function()
			{
	    	var options = {
					   maximumImagesCount: 10,
					   width: 800,
					   height: 800,
					   quality: 80
					  };
			  $cordovaImagePicker.getPictures(options)
			    .then(function (results) {	
			    	angular.forEach(results,function(item)
			    		{
			    		console.log("gallery:");
				    	  base64.convert(item).then(function(data){
				    		  deferred.notify(data);  
				    	  	})
			    		})			        			      
			    }, function(error) {
			      // error getting photos
			    });
			}
		return deferred.promise;
		}
	
       }])
.controller("shotController",["$scope","location","$cordovaCamera","gps","$state","$ionicSlideBoxDelegate","linkCard","loading",function($scope,location,$cordovaCamera,gps,$state,$ionicSlideBoxDelegate,linkCard,loading)
       {  		
	$scope.slide=$ionicSlideBoxDelegate;
      	$scope.name="Ristorante";	
    	$scope.files=[];
    	$scope.tags=["prova"];
    	$scope.slideHasChanged=function(index)
	  		{
	  		if(index==1) $scope.upload();  	  		
	  		//if(index==2) $("#shot .name").focus();
	  		}
    	$scope.upload =	function() 
    		{
    		$scope.files	=	[];	
    	    var options 	= 
    	    	{
    	        quality 			: 75,
        	    destinationType 	: Camera.DestinationType.DATA_URL,
            	sourceType 			: Camera.PictureSourceType.CAMERA,
    	        allowEdit 			: true,
        	    encodingType		: Camera.EncodingType.JPEG,
            	targetWidth			: 414,
    	        targetHeight		: 200,
        	    popoverOptions		: CameraPopoverOptions,
    	        saveToPhotoAlbum	: false,
    	        correctOrientation	: true,
    	        cameraDirection		: navigator.camera.Direction.BACK
        		};    	         	  
        	$cordovaCamera.getPicture(options).then(function(imageData) 
        		{
    		    var img =  "data:image/jpeg;base64," + imageData;
    		    $scope.files.push({img:img});    		    
        		}, function(err) 
        		{
        		
        		});
        		
    		}
    	
    	$scope.save	=	function()
			{	  		
    		var tags=[];
      		angular.forEach($scope.tags,function(value)
      			{
      			tags.push(value.text);
      			})
      			
			var act = this;  	  		
			var obj = 
				{  			
				img			:	$scope.files[0].img,
				name		:	act.name,
				position	:	{lat:gps.latitude,lng:gps.longitude},
				tags 		:	tags,
				txt			:	act.description,
				type		:	"Ristorante"
				}  
			loading.show();
			location.save(obj,function(data)
				{
				linkCard.add(data.uuid).then(function(data)	
		  			{
					loading.hide();
					
		  			$scope.code = data.data.code;
		  			//$state.go("pubs.list");
		 			})
				//$state.go("pubs.list");
				},function(e)
				{		
				alert("KO");
				});  		
			}
    	
    	
      	//$scope.tags.tagging("add","ristorante");
    	
    	
      }]);
