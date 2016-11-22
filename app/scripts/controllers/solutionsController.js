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
      console.log(attempt);
      $scope.attempt = attempt;
      $scope.solutions = solutions.data;
      // TODO
      // $scope.setUpQuestions = function(){
      //   $scope.solutions.forEach(function(solution){
      //     if(solution.ques_type === 'CH'){
      //       // Mark the next n questions as 'isChRelated = True'
      //       var lengthLinkedQuestions = solution.comprehension_list.length;
      //       var currentIndex = $scope.solutions.indexOf(solution);
      //       for(var i=0; i<lengthLinkedQuestions; i++){
      //         $scope.solutions[currentIndex + i + 1].isChRelated = true;
      //         $scope.solutions[currentIndex + i + 1].chQuestion = solution.question;
      //       }
      //       // Remove ch question from the array
      //       $scope.solutions.splice($scope.solutions.indexOf(solution), 1);
      //     }
      //   });
      // }
      // $scope.setUpQuestions();
      $scope.questions = $scope.solutions
      console.log($scope.questions);

      $scope.showSolution = function(question){
        question.show_solution ? question.show_solution = false : question.show_solution=true;
        console.log(question);
      }


    }
  ]);
