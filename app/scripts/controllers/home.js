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
          controller:['$uibModalInstance','paper','$scope','$state','attempt', function($uibModalInstance,paper,$scope,$state,attempt){
            $scope.paper = paper;
            $scope.startPaper = function(){
              $uibModalInstance.close();
              //create the attempt
              attempt.startAttempt(paper.id)
              .then(function(resp){
                attempt.setAttempt(resp.data);
                $state.go('home.attempt',{'pid':resp.data.id,'paper':$scope.paper});  
              },function(err){
                //display error
              });
            }
          }],
          resolve:{
            paper:paper
          }
        });
      };
  }]);
