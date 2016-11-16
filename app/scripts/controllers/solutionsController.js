'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:SolutionsCtrl
 * @description
 * # SolutionsCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('SolutionsCtrl', ['$scope', '$state', 'solutions',
    function ($scope, $state, solutions) {
      console.log(solutions.data);
      $scope.solutions = solutions.data;
      $scope.questions = solutions.data;
      console.log($scope.questions);
  


    }
  ]);
