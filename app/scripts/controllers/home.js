'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('HomeCtrl', ['$scope','$state','available_papers','user_attempts','$uibModal','attempt',
    function ($scope,$state,available_papers,user_attempts,$uibModal,attempt) {
      //$scope.available_papers = available_papers;
      $scope.available_papers = available_papers;
      $scope.user_attempts = user_attempts.data;
      $scope.init = function () {
        //Does initial book keeping for the attempted papers 
        for (var i=0; i<$scope.user_attempts.length; i++){
          var p = _.find($scope.available_papers,function(a){return a.id==$scope.user_attempts[i].paper_info.id});
          if ($scope.user_attempts[i].finished!=true) {
            p['status'] = 'ongoing';
            p['attemptStartTime'] = $scope.user_attempts[i].starttime;
          } else {
            p['status'] = 'attempted';
          }
        }
        // Check for expiry
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

      // Get appropriate local date
      $scope.getTzDate = function(time_str){
        var d = new Date(time_str);
        var date = d.toLocaleDateString();
        return date 
      }

      // Get appropriate local time
      $scope.getTzTime = function(time_str){
        var d = new Date(time_str);
        var time = d.toLocaleTimeString().slice(0,5);
        return time
      }

      $scope.getRemainingTime = function(time_str, duration){
        var now = new Date(); 
        var start = new Date(time_str);
        var time_passed_seconds = Math.floor((now - start)/1000); // Seconds 
        var duration_seconds = duration.split(':')[0] * 3600 + duration.split(':')[1] * 60;
        var delta = duration_seconds - time_passed_seconds;
        return Math.floor(delta/3600) + ":" + Math.floor(delta/60)
        
      }

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
                  //TODO display proper error message
                  alert("Couldn't start paper");
                });
            }
          }],
          resolve:{
            paper:paper
          }
        });
      };

      // Get the results of all the attempts for a paper
      $scope.viewResult = function(paper){
        console.log(user_attempts);
        _.find($scope.user_attempts, function(a){return true})
        $state.go("home.result", {'aid':1000});
      }

      $scope.init();
      $scope.ongoing_papers = _.filter($scope.available_papers, function(p){
        return p.status == 'ongoing';
      });
      $scope.attempted_papers =_.filter($scope.available_papers, function(p){
        return p.status == 'attempted';
      });
      $scope.fresh_papers =_.filter($scope.available_papers, function(p){
        return p.status == undefined;
      });

    }]);
