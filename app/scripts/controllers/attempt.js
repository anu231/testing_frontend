'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('AttemptCtrl', ['$scope','$state','attempt','questions','useranswer',
    function($scope,$state,attempt,questions,useranswer) {
      $scope.init = function(questions,status){
        if (questions!=null){
          $scope.questions = questions.data;
          $scope.setUpQuestions();
        } else {
          attempt.loadQuestions()
            .then(function(resp){
              $scope.questions = resp.data;
              $scope.setUpQuestions();
            })  
        }
      };
      $scope.setUpQuestions = function(){
        $scope.selectedQuestion = $scope.questions[0];
        // Create user ans field if not there
      }
      $scope.init(questions, status);
      // Set the selected question
      $scope.selectQuestion = function(question){
        // Special case for CH type
        if(true){
          console.log(question.ques_type); 
          // Set the next n questions as assertion type
        } else {
        $scope.selectedQuestion = question;
        }
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
        console.log($scope.selectedQuestion); 
      }
      $scope.validateAndFormatAnswer = function(question){ //Saves answer if valid, else returns error sting
        if (question.ques_type=='SC'){
          var validAnswers = ["a","b","c","d"];
          
          if (question.answer==undefined || !validAnswers.includes(question.answer)){
            return 'Please select atleast one valid option';
          } else {
            question.useranswer.answer = question.answer;
          }

        } else if (question.ques_type=='MC'){
          var ansList = [];
          var ansStr = "";
          var validAnswers = ["answerA", "answerB", "answerC", "answerD"];
          if(question.answerA != undefined || question.answerB != undefined 
              || question.answerC != undefined || question.answerD != undefined)
          {
            validAnswers.forEach((va) => {
              if(question[va] == true) ansList.push(va[6].toLowerCase()); //Push the last character A/B/C/D
                ansStr = ansList.toString();  // CSV String 
                question.useranswer.answer = ansStr;
            });
          } else {
            return 'Please select atleast one valid option'; 
          }
          

        } else if (question.ques_type=='MT'){

        } else if (question.ques_type=='IT'){
          if(question.answer == undefined) return 'Please enter an Integer';
          else question.useranswer.answer = question.answer;

        } else if (question.ques_type=='TF'){

        } else if (question.ques_type=='SA'){
          if(question.answer == undefined) return 'Please write SOMETHING! Jeeze...';
          else question.useranswer.answer = question.answer;


        }
        return true;
      }

      $scope.save = function(question){
        if(question.useranswer == undefined){
          question.useranswer = {
            attempt: attempt.attempt.id,
            question: question.id,
            answer: question.answer,
            timetaken: 1 
          } 
          console.log('created ans: ');
          console.log( question.useranswer);
        }
        var ques_valid = $scope.validateAndFormatAnswer(question); // Returns true or error string... ?!

        if (ques_valid==true){
          useranswer.saveAnswer(question.useranswer)
            .then(function(resp){
              question.useranswer = resp;
            },function(err){

            });
        } else {
          console.log(ques_valid);
          alert(ques_valid);
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
