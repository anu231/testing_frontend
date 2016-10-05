'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('AttemptCtrl', ['$scope','$state','Restangular','$rootScope','$http',
  function($scope,$state,Restangular,$rootScope,$http) {
    $scope.$parent.Display_paper = false;
  }]);
