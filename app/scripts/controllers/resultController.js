'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('ResultCtrl',['$scope','$state','attempt','result','paper','p_current_attempt_result','p_user_attempts','p_current_paper',
function ($scope,$state,attempt,result,paper,p_current_attempt_result,p_user_attempts,p_current_paper) {
  var current_attempt_result = p_current_attempt_result.data;
  var current_attempt = _.find(p_user_attempts.data, function(a){return a.id == current_attempt_result.attempt});
  $scope.user_attempts = p_user_attempts.data;
  $scope.selectedPaper = p_current_paper;

  this.initialize = function(){
    $scope.selectAttempt();
  };

  // Data collection and go back
  $scope.goBack = function(){
    $state.go('home');
  };

  // Paper selection pipeline
  $scope.selectAttempt = function(pid){
    $scope.selectedAttempt = {};
    $scope.selectedAttempt.rank = current_attempt_result.mrank;
    $scope.selectedAttempt.marks_obtained = current_attempt_result.marksobt;
    $scope.selectedAttempt.paper_name = current_attempt.paper_info.name;
    $scope.selectedAttempt.attempt_date = (function(){
      var ad = new Date(current_attempt.endtime);
      return ad.toLocaleDateString();
    })();
    $scope.selectedAttempt.duration = current_attempt.paper_info.duration;
    $scope.selectedAttempt.result = current_attempt_result;
  }

  $scope.getResultForAttemptId = function(aid){
  }

  //TODO chartjs helper functions
  $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  this.initialize();

}]);
