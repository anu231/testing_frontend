'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('PaperCtrl', ['$scope','$http','paper_obj','attempts','result','$uibModal', function ($scope,$http,paper_obj, attempts, result, $uibModal) {
      $scope.selected_attempt = undefined;
      $scope.show_solution= false;
      $scope.init = function(){
        console.log(paper_obj);
        console.log(attempts.data);
        $scope.paper = paper_obj;
        //$scope.paper_subj = 
        $scope.attempts = attempts.data;
        $scope.show_omr = $scope.paper.offline && $scope.attempts.length > 0;
        var now = new Date();
        var date_show_solution = new Date($scope.paper.soln_show_date);
        if (now > date_show_solution){
            //show solution
            if ($scope.paper.offline){
              $scope.show_solution = true;  
            } else if ($scope.attempts.length != 0){
              $scope.show_solution = true;  
            }
        }
        if ($scope.attempts.length > 0 ){
          $scope.check_ongoing_attempt();
          $scope.get_attempt_result($scope.attempts[$scope.attempts.length-1]);
        }
        //check if any of the attempts are ongoing
        $('#loading_papers').hide();
      };
      $scope.check_ongoing_attempt = function(){
        $scope.ongoing_attempt = 0;
        $scope.attempts.forEach(function(att){
          if (att.finished != true){
            $scope.ongoing_attempt = att;
          }
        });
      }
      $scope.get_attempt_result = function(attempt){
        console.log(attempt);
        $scope.selected_attempt = attempt;
        if (!$scope.selected_attempt.finished){
          //attempt is not finished yet
          //notify the user
          console.log('attempt not finished');
        } else {
          result.getAttemptResult(attempt.id)
          .then(function(resp){
              $scope.attempt_result = resp.data;
          },function(err){
              //show notification
              $scope.alert_notification({'msg':'Error loading attempt','theme':'error'});
          });
        }
      };
      // Open the "Attempt/Resume paper modal"
      $scope.attempt = function(){
        var latestAttempt=undefined;
        if($scope.attempts.length>0){
          latestAttempt = $scope.attempts[$scope.attempts.length-1];
          var latestAttemptDate = new Date(latestAttempt.starttime);
          latestAttempt.date = latestAttemptDate.toLocaleDateString();
        }
        var paperInstance = $uibModal.open({
          templateUrl:'views/paper-start.html',
          controller:['$uibModalInstance','$scope','$state','attempt','latestAttempt','$interval','paper', function($uibModalInstance,$scope,$state,attempt,latestAttempt,$interval,paper){
            if(latestAttempt != undefined){
              $scope.startedOn = (function(){
                var d = new Date(latestAttempt.starttime);
                var time = d.toLocaleTimeString().slice(0,5);
                return time
              })();
            }
            $scope.latestAttempt = latestAttempt;  // Undefined if first attempt
            $scope.paper = paper;
            $scope.startPaper = function(){
              $uibModalInstance.close();
              $('#loading_papers').show();
              //create the attempt
              paper.status = latestAttempt!=undefined && !latestAttempt.finished?'ongoing':undefined;
              attempt.startOrFetchAttempt(paper, latestAttempt)
                .then(function(resp){
                  attempt.setAttempt(resp.data);
                  $state.go('home.attempt',{'pid':resp.data.id, 'paper': paper});
                },function(err){
                  //TODO display proper error message
                  $('#loading_papers').hide();
                  /*Raven.captureException(err, {
                    level: 'error',
                    logger: 'HomeCtrl',
                    extra:{
                      reason: 'Could not start or fetch attempt'
                    }
                  })*/
                  alert("Couldn't start paper");
                });
            };
            $scope.closeModal = function() {
                $uibModalInstance.close();
            };
          }],
          resolve:{
            paper:$scope.paper,
            latestAttempt: latestAttempt
          }
        });
      };
      $scope.init();
}]);
