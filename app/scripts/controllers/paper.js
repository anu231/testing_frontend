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
        console.log(attempts.data);
        $scope.paper_obj = paper_obj;
        $scope.attempts = attempts.data;

        $('#loading_papers').hide();
      }
      
      $scope.init();
}]);
