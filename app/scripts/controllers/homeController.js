'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('HomeCtrl', ['$scope','$state','available_papers','user_attempts','$uibModal','attempt','userService','$timeout','$window',
    function ($scope,$state,available_papers,user_attempts,$uibModal,attempt, userService,$timeout, $window) {
      //$scope.available_papers = available_papers;
      $scope.available_papers = available_papers;
      $scope.user_attempts = user_attempts.data;

      $scope.init = function () {
        //Does initial book keeping for the attempted papers 
        for (var i=0; i<$scope.user_attempts.length; i++){
          var p = _.find($scope.available_papers,function(a){return a.id==$scope.user_attempts[i].paper_info.id});
          // Array containing all attempts for a paper
          if(p['allAttempts'] != undefined){
            p['allAttempts'].push($scope.user_attempts[i]); 
          } else {
            p['allAttempts'] = [];
            p['allAttempts'].push($scope.user_attempts[i]);
          } 
          if ($scope.user_attempts[i].finished!=true) {
            p['status'] = 'ongoing';
            p['ongoingAttempt'] = $scope.user_attempts[i];
            p['attemptStartTime'] = $scope.user_attempts[i].starttime;
          } else {
            p['status'] = 'attempted';
          }
        }
        // Marks papers if Expired
        $scope.available_papers.forEach(function(paper){if($scope.isExpired(paper)) paper['isExpired'] = true});
      }

      // Checks whether a paper is expired
      // Used in init
      $scope.isExpired = function(paper){
        var last_date = new Date(paper.lastdate);
        var today = new Date();
        var delta = (last_date - today);
        if(delta <= 0) return true;
        else return false;
      }

      // Get appropriate local date string
      $scope.getTzDate = function(time_str){
        var d = new Date(time_str);
        var date = d.toLocaleDateString();
        return date 
      }

      // Get appropriate local time string
      $scope.getTzTime = function(time_str){
        var d = new Date(time_str);
        var time = d.toLocaleTimeString().slice(0,5);
        return time
      }

      // TODO BUGGY
      $scope.getRemainingTime = function(paper){
        var st = new Date(paper.attemptStartTime);
        var now = new Date();
        var time_passed = Math.floor((now - st)/1000);
        var splits = paper.time.split(':');
        var duration = splits[0] * 3600 + splits[1] * 60;
        var delta = duration - time_passed;
        var hrs = Math.floor(delta / 3600);
        var mins = Math.floor(delta % 3600 / 60);
        function format_time(xx){
          if(xx < 10) return "0" + xx;
          else return xx; 
          }
        return format_time(hrs) + ":" + format_time(mins);
      }
        $scope.getRemainingTime2 = function(paper){
        console.log(paper.attemptStartTime);
        
      }

      // Open the "Attempt/Resume paper modal"
      $scope.attemptPaper = function(paper){
        var paperInstance = $uibModal.open({
          templateUrl:'views/paper-start.html',
          controller:['$uibModalInstance','paper','$scope','$state','attempt', function($uibModalInstance,paper,$scope,$state,attempt){
            $scope.paper = paper;
            $scope.startPaper = function(){
              $uibModalInstance.close();
              //create the attempt
              attempt.startOrFetchAttempt(paper, paper.status)
                .then(function(resp){
                  attempt.setAttempt(resp.data);
                  console.log(resp);
                  $state.go('home.attempt',{'pid':resp.data.id, 'paper': $scope.paper});  
                },function(err){
                  //TODO display proper error message
                  console.log(err);
                  alert("Couldn't start paper");
                });
            };
          }],
          resolve:{
            paper:paper
          }
        });
      };

      // Display the results page.
      // Open the result view
      $scope.viewResult = function(paper){
        var latestAttempt = paper.allAttempts.slice(-1)[0];
        $state.go("home.result", {'aid':latestAttempt.id, 'paper':paper});
      };

      $scope.init();

      // Filter papers according to status
      // Note: call only after init()!
      $scope.ongoing_papers = _.filter($scope.available_papers, function(p){
        return p.status == 'ongoing' && !p.isExpired;
      });
      $scope.attempted_papers =_.filter($scope.available_papers, function(p){
        return p.status == 'attempted' && !p.isExpired;
      });
      $scope.fresh_papers =_.filter($scope.available_papers, function(p){
        return p.status == undefined && !p.isExpired;
      });
      $scope.expired_papers = _.filter($scope.available_papers, function(p){
        return p.isExpired == true;
      })

      // Animations
      $('#home_papers_table').scroll(function () {
        var a = $('#home_papers_table').scrollTop();
        var hpt = $('#home_table_head')
        var fh = $('#fake_header')
        if (a >= 20) {
          hpt.addClass('table-head-hidden');
          fh.removeClass('table-head-hidden');
        } else {
          hpt.removeClass('table-head-hidden')
          fh.addClass('table-head-hidden')
        }
      })

    }]);
