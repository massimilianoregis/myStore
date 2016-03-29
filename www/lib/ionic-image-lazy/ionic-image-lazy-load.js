angular.module('ionic-img-lazy-load', [])
.directive('scroller', function($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element) {
            var scrollTimeoutId = 0;
            $scope.invoke = function() {
                $rootScope.$broadcast('scrollEvent');
            };
            $element.bind('scroll', function() {
                $timeout.cancel(scrollTimeoutId);
                scrollTimeoutId = $timeout($scope.invoke, 50);
            });
            $timeout(function(){$scope.invoke()},1000)
        }
    };
})
.factory('lazy-loader',function(){
	return '<i class="icon ion-loading-c loader"></i>';
})
.directive('imageLazySrc', function($document,$timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attributes) {
            $scope.$on('scrollEvent', function() {            	
            	test($element,$attributes);
            });

           function test($element,$attributes)
           		{
        	   	if(isInView() && !$element[0].loaded)
        	   		{
        	   		$element[0].loaded=true;
        	   		$element[0].src = $attributes.imageLazySrc;
        	   		}        	   	
           		}
           
            function isInView() {
                var clientHeight = $document[0].documentElement.clientHeight;
                var clientWidth = $document[0].documentElement.clientWidth;
                var imageRect = $element[0].getBoundingClientRect();
                return (imageRect.top >= 0 && imageRect.bottom <= clientHeight) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
            }
            $element.on('$destroy', function() {
            	$scope.$on('scrollEvent',test);
            });
            
            $timeout(function(){test($element,$attributes)},400); 
            test($element,$attributes);
            
        }
    };
})
.directive('imageLazyLoader', function($document,$timeout) {
	return {
        restrict: 'A',
        link: function($scope, $element, $attributes) {
        	
            $scope.$on('scrollEvent', test);

           function test($element,$attributes)
           		{
        	   	if(isInView())               	
                   if($element[0])$element[0].remove();
        	   	$timeout(function(){test($element,$attributes)},200);
           		}
            function isInView() {
                var clientHeight = $document[0].documentElement.clientHeight;
                var clientWidth = $document[0].documentElement.clientWidth;
                var imageRect = $element[0].getBoundingClientRect();
                return (imageRect.top >= 0 && imageRect.bottom <= clientHeight) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
            }
            $element.on('$destroy', function() {
            	$scope.$on('scrollEvent',test);
            });
            
            test($element,$attributes);
            
        }
    };
})