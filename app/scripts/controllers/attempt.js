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

      // Set the first question as selected one
      // TODO instead of setting this as default, Let the first screen
      // be a mock for INTRO.js
      $scope.setUpQuestions = function(){
        $scope.selectedQuestion = $scope.questions[0];
      }

      $scope.init(questions, status);

      // Set the selected question. Used by the left_panel index
      $scope.selectQuestion = function(question){
        if(true){
          // Special case for CH type
          console.log(question.ques_type); 
          // Set the next n questions as assertion type
        }
        $scope.selectedQuestion = question;
      }

      // Go to next question. Used by "Next" button.
      $scope.nextQuestion = function(){
        var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
        if(currentIndex < $scope.questions.length - 1){
          $scope.selectedQuestion = $scope.questions[currentIndex + 1]
        } else {
          $scope.selectedQuestion.isLast = true; 
        }
      }

      // Go to previous question. 
      // Used by "Previous" control button.
      $scope.previousQuestion = function(){
        var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
        if(currentIndex > 0){
          $scope.selectedQuestion = $scope.questions[currentIndex - 1]
        } else {
          $scope.selectedQuestion.isFirst = true; 
        }
      }

      // Clear user selected/entered answer for the selectedQuestion
      // Used by the "clear" control button
      $scope.clearAnswer = function(){
        $scope.selectedQuestion.answer = undefined;
        $scope.selectedQuestion.answerA = undefined;
        $scope.selectedQuestion.answerB = undefined;
        $scope.selectedQuestion.answerC = undefined;
        $scope.selectedQuestion.answerD = undefined;
      }

      // For testing purposes
      // Used by the "info" control button
      $scope.displayInfo = function(){
        console.log($scope.selectedQuestion); 
      }

      // Set question.useranswer.answer if valid, else returns error string for alert
      // TODO No need to expose this to $scope!! 
      $scope.validateAndFormatAnswer = function(question){ 
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
          // TODO

        } else if (question.ques_type=='IT'){
          if(question.answer == undefined) return 'Please enter an Integer';
          else question.useranswer.answer = question.answer;

        } else if (question.ques_type=='TF'){
          // TODO

        } else if (question.ques_type=='SA'){
          if(question.answer == undefined) return 'Please write SOMETHING! Jeeze...';
          else question.useranswer.answer = question.answer;
        }
        return true;
      }

      // Post answer to the backend if valid, else throw an alert. 
      // Used by the "save" control button.
      $scope.save = function(question){
        // Instantiate useranswer field if not present. Used to track previous attempts(?)
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
        var ques_valid = $scope.validateAndFormatAnswer(question); 

        if (ques_valid==true){
          useranswer.saveAnswer(question.useranswer)
            .then(function(resp){
              question.useranswer = resp;
            },function(err){
              // TODO
              console.log("Couldn't save your answer! Please check your internet connection.");
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
*/
