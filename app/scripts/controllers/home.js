'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('HomeCtrl', ['$scope','$state','available_papers','user_attempts','$uibModal',
    function ($scope,$state,available_papers,user_attempts,$uibModal) {
      $scope.available_papers = available_papers;
      $scope.user_attempts = user_attempts.data;
      $scope.init = function () {
        /*
           Does initial book keeping for the attempted papers
           */
        for (var i=0; i<$scope.user_attempts.length; i++){
          var p = _.find($scope.available_papers,function(a){return a.id==$scope.user_attempts[i].paper_info.id});
          if ($scope.user_attempts[i].finished!=true) {
            p['status'] = 'ongoing';
          } else {
            p['status'] = 'attempted';
          }
        }
      }
      $scope.getTzDate = function(time_str){
        var d = new Date(time_str);
        var date = d.toLocaleDateString();
        return date 
      }
      $scope.getTzTime = function(time_str){
        var d = new Date(time_str);
        var time = d.toLocaleTimeString().slice(0,5);
        return time
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
                  //display error
                });
            }
          }],
          resolve:{
            paper:paper
          }
        });
      };
      $scope.init();
    }]);
