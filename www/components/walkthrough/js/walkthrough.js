angular.module('walkthrough', [
  'ionic',
  'walkthrough.controllers',
  'walkthrough.directives',
  'walkthrough.services',
])
.config(function($stateProvider, $urlRouterProvider) {	
	
  $stateProvider

  .state('walkthrough', {
    url: "/walkthrough",
    templateUrl: "components/walkthrough/views/walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});