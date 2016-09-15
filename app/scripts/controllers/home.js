'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('HomeCtrl', ['$scope','$rootScope','$state','$http',
  	function ($scope,$rootScope,$state,$http) {
    	$scope.init = function(){
    		//get the courses available
    		//TODO
        $scope.Display_courses = true;
    		//get the tests available
    		//TODO - only available tests
        $scope.Display_tests = true;
        $scope.Display_paper =  true;
    		$http.get($rootScope.baseURL+'papers/')
    		.then(function(resp){
    			$scope.Available_tests = resp.data;
    		},function(err){
          console.log(err);
    		});
    	};
      $scope.toggleHome = function(){
        $scope.Display_tests = !$scope.Display_tests;
        $scope.Display_courses = !$scope.Display_courses;
        $scope.Display_paper = !$scope.Display_tests;
      };

      $scope.loadPaper = function(id){
        id = parseInt(id);
        $scope.paper = _.find($scope.Available_tests,function(p){return p.id==id;});
        $scope.toggleHome();
        $state.go('home.paper');
      };
    	$scope.init();
  }]);
