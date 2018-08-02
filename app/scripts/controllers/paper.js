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
      $scope.init = function(){
        console.log(paper_obj);
        $('#loading_papers').hide();
      };
      $scope.get_attempt_result = function(attempt_id){
        result.getAttemptResult(attempt_id)
        .then(function(resp){
            $scope.attempt_result = resp.data;
        },function(err){
            //show notification
        });
      };
      $scope.init();
}]);
