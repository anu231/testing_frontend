'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('MainCtrl',['$state','$rootScope','$scope', 
  	function ($state,$rootScope,$scope) {
    $scope.init = function(){
    	//$rootScope.baseURL = 'http://localhost:8000/';
    	//$scope.uirouterDebug();
    	$state.go('home');
    };
    $scope.uirouterDebug = function(){
    	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
		  console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
		});
		$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
		  console.log('$stateChangeError - fired when an error occurs during transition.');
		  console.log(arguments);
		});
		$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
		  console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
		});
		$rootScope.$on('$viewContentLoading',function(event, viewConfig){
		   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
		});
		// $rootScope.$on('$viewContentLoaded',function(event){
		//   // runs on individual scopes, so putting it in "run" doesn't work.
		//   console.log('$viewContentLoaded - fired after dom rendered',event);
		//});
		$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
		  console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
		  console.log(unfoundState, fromState, fromParams);
		});
    };
    $scope.init();
  }]);