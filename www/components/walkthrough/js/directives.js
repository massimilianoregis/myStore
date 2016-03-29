angular.module('walkthrough.directives', [])

.directive('deviceSlider', function($ionicPlatform) {
	return {
		scope: {
			device: '@'
		},
		restrict: 'E',
		replace: true,
		transclude: true,
		controller: function($scope, $element, $attrs) {
			this.propagateTouch = function(touch_event){
				$scope.$broadcast("propagate-touch", touch_event);
			};
		},
		link: function(scope, element, attr){
			if(attr.device == "auto" && $ionicPlatform.is("android"))
			{
				attr.device = "nexus6";
			}

			if(attr.device == "auto" && $ionicPlatform.is("ios"))
			{
				attr.device = "iphone5";
			}
		},
		templateUrl: 'components/walkthrough/views/common/misc/device-slider.html'
	};
})

.directive('deviceFrame', function() {
	return {
		restrict: 'E',
		require: '^deviceSlider',
		link: function(scope, element, attr, deviceSliderCtrl) {
			var ele = element[0];
			ele.addEventListener('touchstart', function(event){
				deviceSliderCtrl.propagateTouch(event);
				// Don't need to call again center tabs, because as we mimic touch events,
				// when we start touching here it will start the touch move on the panels,
				// and that will trigger the center tabs action
      }, false);

			ele.addEventListener('touchmove', function(event){
				deviceSliderCtrl.propagateTouch(event);
      }, false);

			ele.addEventListener('touchend', function(event){
				deviceSliderCtrl.propagateTouch(event);
      }, false);
		}
	};
})

.directive('deviceSlides', function(TouchService) {
	return {
		restrict: 'E',
		require: '^deviceSlider',
		link: function(scope, element, attr, deviceSliderCtrl) {
			var slider_slides = element[0].querySelector('.slider-slides');

			scope.$on("propagate-touch", function(event, propagated_touch){
				TouchService.triggerTouch(slider_slides, propagated_touch);
			});
		}
	};
})

;
