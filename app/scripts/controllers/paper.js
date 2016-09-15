'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('PaperCtrl', ['$scope','$state',
  function($scope,$state) {
    console.log($scope.paper);
    $scope.go2Home = function(){
    	$scope.toggleHome();
    	$state.go('home');
    };
    $scope.startAttempt = function(){
    	
    }
  }]);
