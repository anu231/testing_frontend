'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('AttemptCtrl', ['$scope','$state','$sce','attempt','questions','status',
  function($scope,$state,$sce,attempt,questions,status) {

    // Initilization
    $scope.questions = questions.data;

    //Select and display the clicked question
    $scope.select = function(e, $index){
      var question_no = $index + 1;
      displayQuestion($index);
    }

    // Used with select()
    function displayQuestion(index){
      console.log('displaying question:' + (index + 1));
      var Q = $scope.questions[index];
      var question_body = Q.question;
      $scope.selectedQuestion = $sce.trustAsHtml(question_body);
      $scope.option1 = $sce.trustAsHtml(Q.ans1);
      $scope.option2 = $sce.trustAsHtml(Q.ans2);
      $scope.option3 = $sce.trustAsHtml(Q.ans3);
      $scope.option4 = $sce.trustAsHtml(Q.ans4);
    }
    
    
  }]);


/* Notes :
Question = questions.data[#]
body: Question.question
layout: Question.layout
type: Question.ques_type
subject: Question.subj

opt1: Question.ans1
opt2: Question.ans2
opt3: Question.ans3
opt4: Question.ans4

State: The state of the question - (q*)
  qua: UnAttempted
  qsel: Currently Selected
  qa: Attempted              (Same as qm) 
  qc: Confirmed
  qm: Marked (for later review)  (Depricated. Use qa instead)

Type: Type of the question - (t*)
  MC: Multiple choice questions
  SC: Single choice 
  MT: Matrix Type
  CH: ???
  AR: ???
  SA: ???

Subject: The subject the question belongs to - (s*)
  math


*/
