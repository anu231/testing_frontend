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
      $scope.getTzTime = function(time_str){
        var d = new Date();
        var offset = d.getTimezoneOffset();
        var reg = /(.*)T(.*)Z/;
        var date = reg.exec(time_str)[1]
        var UTCtime = reg.exec(time_str)[2]
        var uHH = UTCtime.split(':')[0]
        var uMM = UTCtime.split(':')[1]
        var oHH = Math.floor(offset/60);
        var oMM = offset % 60;
        var lHH = parseInt(uHH) + parseInt(oHH);
        var lMM = parseInt(uMM) + parseInt(oMM);
        var time = (lHH) + ':' + (lMM);
        console.log(time);
        
        return date + " " + time
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
