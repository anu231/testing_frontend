'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('HomeCtrl', ['$scope','$state','available_papers','attempted_papers','$uibModal',
  	function ($scope,$state,available_papers,attempted_papers,$uibModal) {
    	$scope.available_papers = available_papers;
      $scope.attempted_papers = attempted_papers;
      $scope.attemptPaper = function(paper){
        var paperInstance = $uibModal.open({
          templateUrl:'views/paper-start.html',
          controller:['$uibModalInstance','paper','$scope','$state', function($uibModalInstance,paper,$scope,$state){
            $scope.paper = paper;
            $scope.startPaper = function(){
              $state.go('home.attempt',{'pid':paper.id});
            }
          }],
          resolve:{
            paper:paper
          }
        });
      };
  }]);
