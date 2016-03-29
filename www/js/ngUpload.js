angular.module("ngUpload",[])
.directive("upload",[function()
    {
	
	
	return function(scope, elem, attr) 
		{
		var gallery =$(elem[0]).attr("addTo");
		
		var chosen = function(ev)
            {
            var act = this;
            if (ev.target.files && ev.target.files[0]) 
            	{
                var FR = new FileReader();
                FR.onload = function (e) 
                	{
                    var binaryString = e.target.result;                                            
                    scope.$apply(function()
                    	{                    	
                    	scope.$eval(gallery).push({img:binaryString});	
                    	})
                                                            
                	};
                FR.readAsDataURL(ev.target.files[0]);
            	}
            }
		
		var input = $("<input/>",{type:"file"});
		input.change(chosen)
		var form = $("<form/>"); form.append(input);
		form.hide();
		$("body").append(form);
		
		
		$(elem[0]).click(function(){console.log("---");input.click()})
		}
    }])

    
