'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('ResultCtrl',['$scope','$state','attempt','result','paper','current_attempt_result','user_attempts','current_paper',function ($scope,$state,attempt,result,paper,current_attempt_result,user_attempts,current_paper) {
  $scope.current_attempt_result = current_attempt_result.data;
  $scope.user_attempts = user_attempts.data;
  $scope.current_attempt = _.find(user_attempts.data, function(a){return a.id == $scope.current_attempt_result.attempt});
  $scope.current_paper = current_paper;

  this.initialize = function(){
    $scope.result = current_attempt_result.data;
    $scope.selectCurrentPaper;
  }

  // Data collection and go back
  $scope.goBack = function(){
    $state.go('home');
  }

  $scope.selectCurrentPaper = function(pid){
    // selects a paper to display results 
    // attempt.getResultForAttemptId(pid)
    console.log($scope.result);
    console.log($scope.current_attempt);
    $scope.rank = $scope.result.mrank;
    $scope.marks_obtained = $scope.result.marksobt;
    $scope.paper_name = $scope.current_attempt.paper_info.name;
    var ad = new Date($scope.current_attempt.endtime);
    $scope.attempt_date = ad.toLocaleDateString();
    $scope.duration = $scope.current_attempt.paper_info.duration;
  }

  $scope.getResultForAttemptId = function(aid){
  }


  //TODO mark calculation functions.
  //TODO chartjs helper functions

  this.initialize();

}]);
