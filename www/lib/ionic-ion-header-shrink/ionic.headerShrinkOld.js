angular.module('ionic.ion.headerShrink', [])
.directive('headerShrink', function($document) {
    var fadeAmt;

    var shrink = function(tabs, tabs_amt, subHeader, header,title, amt, dir) {
      ionic.requestAnimationFrame(function() {    	          
        var threshold = subHeader.offsetHeight; // Threshold is equal to bar-height
                
        if(dir === 1)		// Scrolling down 
          var _amt = Math.min(threshold, amt - threshold);                
        else if(dir === -1)	// Scrolling up 
          var _amt = Math.max(0, amt - threshold);
        
        // The translation amounts should never be negative
        _amt = _amt < 0 ? 0 : _amt;
         amt = amt < 0 ? 0 : amt;
        tabs_amt = tabs_amt < 0 ? 0 : tabs_amt; 
        // Re-position the header
        			header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + _amt + 'px, 0)';
        if(title) 	title.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + _amt + 'px, 0)';
        
        fadeAmt = 1 - _amt / threshold;
        title.style.opacity=fadeAmt;
        
        for(var i = 0;i < header.children.length; i++) {        	
          header.children[i].style.opacity = fadeAmt;          
        }
        // Re-position the sub-header
        if(subHeader)	subHeader.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + amt + 'px, 0)';
        // Re-position the tabs
        if(tabs)		tabs.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + tabs_amt + 'px, 0)';
      });
    };

    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var starty = 0;
        var shrinkAmt;
        var tabs_amt;
        // Threshold is equal to bar-height + create-post height;
        var threshold = 44;
        // header
        var title 			= $document[0].body.querySelector('*[nav-bar=active] .bar-header');
        var header 			= $document[0].body.querySelector('.bar-header');
        var subHeader 		= $document[0].body.querySelector('.bar-subheader');
        var headerHeight 	= header.offsetHeight;        
        var subHeaderHeight = subHeader?subHeader.offsetHeight:0;
        
        // tabs
        var tabs 			= $document[0].body.querySelector('.bar-footer');
        var tabsHeight 		= tabs.offsetHeight;

        var prev 			= 0
        var delta 			= 0
        var dir 			= 1
        var prevDir 		= 1
        var prevShrinkAmt 	= 0;
        var prevTabsShrinkAmt = 0;
        
        $element.bind('scroll', function(e) {
          var actScroll=e.originalEvent.detail.scrollTop;
          // if negative scrolling (eg: pull to refresh don't do anything)          
          if(actScroll < 0)
            return false;
          delta = actScroll - prev;
          // Claculate direction of scrolling
          dir = delta >= 0 ? 1 : -1;
          
          // Capture change of direction
          if(dir !== prevDir) 
            starty = actScroll;
          // If scrolling up
          if(dir === 1) {
            shrinkAmt 	= headerHeight + subHeaderHeight - Math.max(0, (starty + headerHeight + subHeaderHeight) - actScroll	);
            tabs_amt 	= tabsHeight 					 - Math.max(0, (starty + tabsHeight) - actScroll);

            shrink(tabs, tabs_amt, subHeader, header,title, Math.min(threshold, shrinkAmt), dir);

            prevShrinkAmt 		= Math.min(threshold, shrinkAmt);
            prevTabsShrinkAmt 	= Math.min(tabsHeight, tabs_amt);
          }
          else {
            shrinkAmt 	= prevShrinkAmt 	- Math.min(threshold, (starty - actScroll));
            tabs_amt 	= prevTabsShrinkAmt - Math.min(tabsHeight, (starty - actScroll));
            
            shrink(tabs, tabs_amt, subHeader, header,title, shrinkAmt, dir);
            
            //prevShrinkAmt 		= Math.min(threshold, shrinkAmt);
            //prevTabsShrinkAmt 	= Math.min(tabsHeight, tabs_amt);
          }
          // Save prev states for comparison 
          prevDir = dir;
          prev = actScroll;
        });
      }
    }
  })

