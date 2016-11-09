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
  $scope.processed_current_paper_attempts = [];  // One time processing for "Overtime trend" bar chart
  $scope.selectedPaper = p_current_paper;
  // Fetch the paper (Review)
  paper.getPaper(current_attempt.paper_info.id).then(function(resp){
    $scope.selectedPaper = resp;
    $scope.initialize();
  }, function(err){console.log(err);});


  $scope.initialize = function () {
    result.getAllAttemptResults().then(function (resp) {
      $scope.allAttemptResults = _.filter(resp.data, function (r) { return true });
      $scope.current_paper_attempts.forEach(function (attempt) {
        var result = _.find($scope.allAttemptResults, function (result) { return result.attempt == attempt.id });
        if (result) {
          attempt.result = result;
          $scope.processed_current_paper_attempts.push(attempt);
        }
      })
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
  // Basically sets the $scope.selectedAttempt variable.
  // $scope.selectedAttempt is used as the model for result area.
  $scope.selectAttempt = function(aid){
    var att = _.find($scope.current_paper_attempts, function(a){return a.id == aid});
    var result = _.find($scope.allAttemptResults, function(r){return att.id == r.attempt})
    if(!result){
      alert("No result found!");
      throw "No result found!"
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
    $scope.selectedAttempt.netScore = (function(){
      var r = $scope.selectedAttempt.result;
      var correct = 0, incorrect = 0;
      correct = [r.pcorr,r.ccorr,r.mcorr,r.bcorr,r.zcorr].reduce(function(total, val){
        return total + val;
      });
      incorrect = [r.pwrong,r.cwrong,r.mwrong,r.bwrong,r.zwrong].reduce(function(total, val){
        return total + val;
      });
      return {correct: correct, incorrect: incorrect};
      
    })();
    $scope.updateCharts();
  }

  //                              >> CHARTS AND ANALYSIS <<                     //
  // Updates charts based on selectedAttempt
  $scope.updateCharts = function () {
    console.log("updating charts");
    $scope.updateBarChart();
    $scope.updatePieChart();
  }
  
  $scope.updatePieChart = function(){
    var r = $scope.selectedAttempt.result;
    $scope.pie = {};
    $scope.pie.labels = ["Physics", "Chemistry", "Maths", "Biology", "Zoology"];
    $scope.pie.data = [r.pobt,r.cobt,r.mobt,r.bobt,r.zobt];
    $scope.pie.options = {
      title:{
        display: true,
        text: "Mark Distrubution",
        fontSize: 16,
        padding: 20,
      },
      legend:{
        display: true,
        position: "right"
      }
    };
  }

  $scope.updateBarChart = function(){
    var ptrend = [],
        ctrend = [],
        mtrend = [],
        btrend = [],
        ztrend = []

    // TODO HIDE IF ONLY ONE ATTEMPT
    // Logic
    $scope.bar = {};
    $scope.bar.series = ["Physics", "Chemistry", "Maths", "Biology", "Zoology"];
    $scope.bar.labels = [];
    $scope.processed_current_paper_attempts.forEach(function(a){
      var date = new Date(a.endtime);
      $scope.bar.labels.push(date.toLocaleDateString());
      ptrend.push(a.result.pobt)
      ctrend.push(a.result.cobt)
      mtrend.push(a.result.mobt)
      btrend.push(a.result.bobt)
      ztrend.push(a.result.zobt)
    });

    // Graphics

    $scope.bar.data = [ptrend, ctrend, mtrend, btrend, ztrend];
    $("#leg").html = 
    $scope.bar.options = {
      title: {
        display: true,
        text: "Trend Over Time",
        fontSize: 16,
        padding: 20,
      },
      legend: {
        display: true,
      },
      labels: {
        fontSize: 6
      }
    }
  }


  $scope.debug = function(){
    console.log($scope);
  }
}]);