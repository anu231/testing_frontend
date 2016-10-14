'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('AttemptCtrl', ['$scope','$state','attempt','questions','status','useranswer',
  function($scope,$state,attempt,questions,status,useranswer) {
    $scope.questions = questions.data;

    $scope.init = function(questions,status){
      questions.data.forEach((question) => {
        question.answer = '';
        question.useranswer = {
          'attempt':attempt.attempt.id;
          'question':question.id;
          'answer':'',
          'timetaken':null
        };
      })
    };

    $scope.init(questions, status);
    

    // Set the selected question
    $scope.selectQuestion = function(question){
      $scope.selectedQuestion = question;
    }

    $scope.nextQuestion = function(){
      var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
      if(currentIndex < $scope.questions.length - 1){
        $scope.selectedQuestion = $scope.questions[currentIndex + 1]
      } else {
        $scope.selectedQuestion.isLast = true; 
      }
    }

    $scope.previousQuestion = function(){
      var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
      if(currentIndex > 0){
        $scope.selectedQuestion = $scope.questions[currentIndex - 1]
      } else {
        $scope.selectedQuestion.isFirst = true; 
      }
    }

    $scope.displayInfo = function(){
      console.log($scope.selectedQuestion.answer); 
    }
    $scope.validateAnswer = function(question){
      if (question.ques_type=='SC'){

      } else if (question.ques_type=='MC'){

      }
      return true;
    }
    $scope.formatAnswer = function(question){
      //formats the answer according to the type of the question
      if (question.ques_type=='MC'){

      } else if (question.ques_type=='MT'){

      }
    }
    $scope.save = function(question){
      $scope.formatAnswer(question);
      if ($scope.validateAnswer(question)){
        userans.saveAnswer(question);
      }
    };
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
