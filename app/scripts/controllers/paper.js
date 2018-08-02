'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('PaperCtrl', ['$scope','$http','paper_obj','attempts','result', function ($scope,$http,paper_obj, attempts, result) {
      $scope.selected_attempt = undefined;
      $scope.init = function(){
        console.log(paper_obj);
        console.log(attempts.data);
        $scope.paper_obj = paper_obj;
        $scope.attempts = attempts.data;
        $('#loading_papers').hide();
      };
      $scope.get_attempt_result = function(attempt){
          console.log(attempt);
        $scope.selected_attempt = attempt;
        result.getAttemptResult(attempt.id)
        .then(function(resp){
            $scope.attempt_result = resp.data;
        },function(err){
            //show notification
            $scope.alert_notification({'msg':'Error loading attempt','theme':'error'});
        });
      };
      $scope.init();
}]);
