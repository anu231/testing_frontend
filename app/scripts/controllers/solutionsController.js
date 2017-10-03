'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:SolutionsCtrl
 * @description
 * # SolutionsCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('SolutionsCtrl', ['$scope', '$state', 'solutions', 'attemptInstance','$stateParams', '$sce',
    function ($scope, $state, solutions, attemptInstance, $stateParams, $sce) {
      document.title = "Solutions and Answer Key";
      $('#loading_papers').hide();
      if(attemptInstance){
        $scope.attempt = attemptInstance.data ? attemptInstance.data : attemptInstance;
      }
      else {
        if ($stateParams.attempted){
          alert('No attempt info');
        }
      }
      $scope.solutions = solutions.data;
      $scope.questions = $scope.solutions;
      //add a index for all the questions
      var index = 1;
      for (var i=0; i<$scope.questions.length; i++){
        if ($scope.questions[i].ques_type != 'CH'){
          $scope.questions[i]['index'] = index;
          index++;
        }
      }

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

      $scope.debug = function(question) {
        console.log(question.answer_key);
        console.log(question.useranswer.answer);
        console.log(question.useranswer.answer_key);
        console.log(question.useranswer.score);
        console.log('');
      }

    }
  ]);
