'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:SolutionsCtrl
 * @description
 * # SolutionsCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('SolutionsCtrl', ['$scope', '$state', 'solutions', 'attempt', '$sce',
    function ($scope, $state, solutions, attempt, $sce) {
      document.title = "Solutions and Answer Key";
      $('#loading_papers').hide();
      $scope.attempt = attempt;
      $scope.solutions = solutions.data;
      $scope.questions = $scope.solutions

      // Don't sanatize Latex images
      $scope.trustedHtml = function (html) {
        return $sce.trustAsHtml(html);
      }

      $scope.showSolution = function (question) {
        question.show_solution ? question.show_solution = false : question.show_solution = true;
        console.log(question);
      }

      $scope.goBack = function () {
        window.history.back();
      };

    }
  ]);
