'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:SolutionsCtrl
 * @description
 * # SolutionsCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('SolutionsCtrl', ['$scope', '$state', 'solutions', 'attempt',
    function ($scope, $state, solutions, attempt) {
      document.title = "Solutions and Answer Key";
      console.log(attempt);
      $scope.attempt = attempt;
      $scope.solutions = solutions.data;

      $scope.questions = $scope.solutions
      console.log($scope.questions);

      $scope.showSolution = function(question){
        question.show_solution ? question.show_solution = false : question.show_solution=true;
        console.log(question);
      }


    }
  ]);
