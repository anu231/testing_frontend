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
    $scope.questions = questions.data;

    $scope.init = function(questions,status){
      questions.data.forEach((question) => {
        status.data.push({id:question.id, answer: question.answer});
      })
    };

    $scope.init(questions, status);
    console.log(status.data);
    

    // Set the selected question
    $scope.selectQuestion = function(question){
      $scope.selectedQuestion = question;
    }

    // Update status with selected answer
    $scope.selectOption = function(selectedQuestion){
      //console.log("Selected option: for question" + $scope.selectedQuestion); 
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
  MC: Multiple choice questions {Checkboxes}
  SC: Single choice {RadioButtons} 
  MT: Matrix Type  {???}
  CH: Comprehension {TextArea}
  AR: Assertion Reason {???}
  SA: Subjective Answers {TextArea}

Subject: The subject the question belongs to - (s*)
  math


*/
