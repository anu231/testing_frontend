'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('PaperCtrl', ['$scope','$http','paper_obj','attempts', function ($scope,$http,paper_obj, attempts) {
      $scope.init = function(){
        console.log(paper_obj);
        $('#loading_papers').hide();
      }
      $scope.init();
}]);
