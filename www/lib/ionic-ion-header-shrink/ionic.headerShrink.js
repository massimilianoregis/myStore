angular.module('ionic.ion.headerShrink', [])
.directive('headerShrink', function($interval,$document) {
    var fadeAmt;
    var shrink = function(tabs, subHeader, header, delta) {    	
        ionic.requestAnimationFrame(function() {           
          var y = (subHeader.y||0)+delta;
          if(y<0) y=0;
          if(y>subHeader.outerHeight()+header.outerHeight()) y=subHeader.outerHeight()+header.outerHeight();                  	 
          subHeader.y =y;
          subHeader.css(ionic.CSS.TRANSFORM,'translate3d(0,-' + subHeader.y + 'px, 0)');
          
          y = (header.y||0)+delta;
          if(y<0) y=0;
          if(y>header.outerHeight()) y=header.outerHeight();          
          if(subHeader.y>=subHeader.outerHeight() || delta<0)
        	  {        	  
        	  header.y =y;        	  
        	  header.css(ionic.CSS.TRANSFORM,'translate3d(0,-' + header.y + 'px, 0)');
        	  }
         
        	
          y = (tabs.y||0)+delta;          
          if(y<0) y=0;
          if(y>(parseInt(tabs.attr("shrink-height"))||tabs.outerHeight())) y=(parseInt(tabs.attr("shrink-height"))||tabs.outerHeight());
  
          tabs.y =y;        	  
          tabs.css(ionic.CSS.TRANSFORM,'translate3d(0,' + tabs.y + 'px, 0)');
        });
        
        return ((subHeader.y||0)+delta)<0;
        //return ((header.y||0)+delta)<0;
      };
    return {
      restrict: 'A',      
      link: function($scope, $element, $attr) {
        var starty = 0;
        var shrinkAmt;
        var tabs_amt;
        // Threshold is equal to bar-height + create-post height;
        var threshold = 88;
        // header        
        var header 			= $document.find('.bar-header');
        var subHeader 		= $document.find('.bar-subheader');        
        // tabs
        var tabs 			= $document.find('.bar-footer,.tabs');        

        var prev = 0
        var delta = 0
        var dir = 1
        var prevDir = 1
        var prevShrinkAmt = 0;
        var prevTabsShrinkAmt = 0;    
        
        $scope.$root.$on('open-header',function(e){        	
        	var timer = $interval(function(){
        		if(shrink(tabs,subHeader,header,-2)) 
        			{
        			$interval.cancel(timer);
        			}
        	},10);        		
        });
        
        $element.bind('scroll', function(e) {
        	
        	var scroll=e.currentTarget.scrollTop || e.originalEvent.detail.scrollTop;          
            if(scroll < 0)	return false;
            delta = scroll - prev;
            
            if(delta==0) return;            
            
            shrink(tabs,subHeader,header,delta);
            
            prevDir = dir;
            prev = scroll;
        })       
      }
    }
  })

