'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('ResultCtrl',['$scope','attempt','result','paper','available_papers','user_attempts',function ($scope,attempt,result,paper,available_papers,user_attempts) {
  $scope.aki = "yolo";
  $scope.available_papers = available_papers;
  $scope.user_attempts = user_attempts.data;

  this.initialize = function(){
    //Does initial book keeping for the attempted papers 
    //Identical to home.js init()
    for (var i=0; i<$scope.user_attempts.length; i++){
      var p = _.find($scope.available_papers,function(a){return a.id==$scope.user_attempts[i].paper_info.id});
      // Array containing all attempts for a paper
      if(p['allAttempts'] != undefined){
        p['allAttempts'].push($scope.user_attempts[i]); 
      } else {
        p['allAttempts'] = [];
      } 
      if ($scope.user_attempts[i].finished!=true) {
        //TODO ignore unfinished
        p['status'] = 'ongoing';
        p['ongoingAttempt'] = $scope.user_attempts[i];
        p['attemptStartTime'] = $scope.user_attempts[i].starttime;
      } else {
        p['status'] = 'attempted';
      }
    }
    // Check for expiry
    $scope.available_papers.forEach(function(paper){if($scope.isExpired(paper)) paper['isExpired'] = true});
  }



  // Gets the result...
  $scope.yolo = function(){
  }

  $scope.selectCurrentPaper = function(pid){
    // selects a paper to display results 
    console.log($scope.attemptedPapers);

  }

  $scope.getResultForAttemptId = function(aid){
    console.log($scope.available_papers);
    result.getResultForAttemptId()
      .then(function(resp){
        //TODO set result to scope
        //$scope.selectedPaper.result = resp.data
        console.log(resp);
      },
      function(err){
        console.log(err);
      })
  }

  $scope.goBack = function(){
    // Go back to home.html 
  }

  //TODO mark calculation functions.
  //TODO chartjs helper functions

  this.initialize();

}]);
