'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('ResultCtrl',['$scope','attempt', function ($scope,attempt) {
  $scope.aki = "yolo";
  this.initialize = function(){
    // Set paper to scope
    // Get result for the latest attempt ID
  }

  this.getResultForAttemptId = function(aid){
  
  }

  this.goBack = function(){
    // Go back to home.html 
  }

  //TODO mark calculation functions.
  //TODO chartjs helper functions

  this.initialize();

}]);
