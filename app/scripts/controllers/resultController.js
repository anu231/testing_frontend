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
  $scope.current_paper_attempts = _.filter(p_user_attempts.data, function(a){return a.paper_info.id == current_attempt.paper_info.id});
  $scope.selectedPaper = p_current_paper;
  // Fetch the paper (Review)
  paper.getPaper(current_attempt.paper_info.id).then(function(resp){
    $scope.selectedPaper = resp;
    $scope.initialize();
  }, function(err){console.log(err);});

 

  $scope.initialize = function(){
    $scope.getAllAttemptResults();
  };
  $scope.getAllAttemptResults = function () {
    result.getAllAttemptResults().then(function (resp) {
      $scope.allAttemptResults = _.filter(resp.data, function (r) { return true });
      $scope.selectAttempt(current_attempt.id);
    }, function (err) {
      console.log("Couldnt fetch results...");
    })
  }
  // Data collection and go back
  $scope.goBack = function(){
    $state.go('home');
  };

  // Paper selection pipeline
  $scope.selectAttempt = function(aid){
    var att = _.find($scope.current_paper_attempts, function(a){return a.id == aid});
    var result = _.find($scope.allAttemptResults, function(r){return att.id == r.attempt})
    if(!result){
      alert("No result found!");
      return
    }
    $scope.selectedAttempt = {};
    $scope.selectedAttempt.id = att.id;
    $scope.selectedAttempt.rank = result.mrank;
    $scope.selectedAttempt.marks_obtained = result.marksobt;
    $scope.selectedAttempt.paper_name = att.paper_info.name;
    $scope.selectedAttempt.expiry_date = (function(){
      var ad = new Date($scope.selectedPaper.lastdate);
      return ad.toLocaleDateString();
    })();
    $scope.selectedAttempt.attempt_date = (function(){
      var ad = new Date(att.endtime);
      return ad.toLocaleDateString();
    })();
    $scope.selectedAttempt.duration = (function () {
      var dur = att.paper_info.duration;
      // TODO
      return Math.floor(dur / 60 / 60) + ":" + dur % 60;
    })();
    // TODO check for missing results
    $scope.selectedAttempt.result = (function(){
      return _.find($scope.allAttemptResults, function(r){return r.attempt == att.id})
    })();

    // Update charts
    $scope.updateCharts();
  }

  $scope.getResultForAttemptId = function(aid){
  }

  
  //                              >> CHARTS AND ANALYSIS <<                     //
  // Updates charts based on selectedAttempt
  $scope.updateCharts = function () {
    console.log("updating charts");
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
  }
  // $scope.initialize();

  $scope.debug = function(){
    console.log($scope);
  }
}]);
