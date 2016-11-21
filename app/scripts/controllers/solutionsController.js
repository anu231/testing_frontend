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
      // $scope.solutions.forEach(function (s) {
      //   // Remove CH type questions.
      //  if(s.ques_type === 'CH'){
      //       // Mark the next n questions as 'isChRelated = True'
      //       var lengthLinkedQuestions = s.comprehension_list.length;
      //       var currentIndex = $scope.solutions.indexOf(s);
      //       for(var i=0; i<lengthLinkedQuestions; i++){
      //         $scope.solutions[currentIndex + i + 1].isChRelated = true;
      //         $scope.solutions[currentIndex + i + 1].chQuestion = s.question;
      //       }
      //       // Remove ch question from the array
      //       $scope.solutions.splice($scope.solutions.indexOf(s), 1);
      //     }
      // });
      $scope.questions = $scope.solutions
      console.log($scope.questions);

      $scope.showSolution = function(question){
        question.show_solution ? question.show_solution = false : question.show_solution=true;
      }


    }
  ]);
