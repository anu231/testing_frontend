'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.config(function(snapRemoteProvider){
  // Disable touch to drag - not very intuitive, and very buggy.
  snapRemoteProvider.globalOptions = {
    disable: 'right',
    touchToDrag: false
  };
})
.controller('AttemptCtrl', ['$scope','$state','attempt','questions','useranswer','$timeout','$interval','$window','$document',
    function($scope,$state,attempt,questions,useranswer,$timeout, $interval, $window, $document) {
      $scope.init = function(questions){
        $scope.paper_title = attempt.attempt.paper_info.name;
        if (questions!==null){
          $scope.questions = questions.data;
          $scope.paper_title = attempt.attempt.paper_info.name;
          $scope.setUpQuestions();
        } else {
          attempt.loadQuestions()
            .then(function(resp){
              $scope.questions = resp.data;
              $scope.setUpQuestions();
            }); 
        }
      };

      // Autosave all the attempted questions
      // Used by the 10 minute autosave reminder modal
      $scope.autoSave = function(){
        console.log("Auto Saving question "); 
        var autosave_ua = [];
        $scope.questions.forEach(function(q){
          if(q.useranswer!==undefined){  // undefined == never viewed/clicked. Timetaken == 0
            console.log("autosaving: " + q.id);
            if(q.answer !==undefined){
              var ques_valid = $scope.validateAndFormatAnswer(q); 
              if(ques_valid === true){ autosave_ua.push(q.useranswer);}
            }else if(q.useranswer.answer ==="null" && q.isAnswered){  // null == answered but never saved. Timetaken != 0
              q.useranswer.timetaken = q.timetaken;
              autosave_ua.push(q.useranswer);
            } else {
            }
            $scope.alert_notification({msg:"Autosave complete", theme: "green"});
          }
        });
        attempt.autoSave(autosave_ua).then(function(resp){
          resp.data.forEach(function(ua){
            var qs = _.find($scope.questions,function(qs){return qs.id===ua.question;});
            qs.useranswer = ua;
            qs.useranswer.isSubmitted=true;
            qs.isAnswered = true;
            if(qs.ques_type==="SC" ||  qs.ques_type==="SA"){
              qs.answer = ua.answer; 
            } else if (qs.ques_type === "IT"){
              qs.answer = parseInt(ua.answer);
            } else if (qs.ques_type === "MC" || qs.ques_type === "MT") {
              $scope.deserializeAndSetAnswer(qs, ua.answer); 
            }
          });
        }, function(err){
          console.log(err);
        });

      };
      // Finish/end paper cleanup code
      $scope.finish = function(){
        console.log("Autosave all questions and quit"); 
        $scope.loading = true; // Shows loading sign
        $('#final_finish_button').attr('disabled', 'disabled');
        $('#final_resume_button').attr('disabled', 'disabled');
        $scope.autoSave();
        attempt.finishAttempt().then(function(resp){
          if(resp.status === 200){
            $('#exitModal').modal('hide');
            $('#cleanupModal').modal('hide');
            //$timeout(function(){$window.location = "/#/home";}, 1000);
            $timeout(function(){$state.go('^',{},{reload:true});}, 1000);
          } else {
            // TODO is this necessary?
            alert("CRITICAL ERROR: Couldn't connect to server!  STATUS CODE != 200");
          }
        }, function(err){
          $('#final_resume_button').attr('disabled', 'disabled');
          console.log(err);
          alert("CRITICAL ERROR: Couldn't connect to server! Please try again");
        });
      }

      // Sets the answer according to the response
      // Called by the loadQuestionStatus()
      $scope.deserializeAndSetAnswer = function(question, ans_str){
        if(question.ques_type === "MC"){
          var opts = ans_str.split(',');
          opts.forEach(function(o){question["answer" + o.toUpperCase()] = true});
        }else if(question.ques_type === "MT"){
          var ans_obj = JSON.parse(ans_str);
          var formatted_ans_obj = {"A":{},"B":{},"C":{}, "D":{}};
          ["A","B","C","D"].forEach(function(opt){
            ans_obj[opt].forEach(function(letter){
              formatted_ans_obj[opt][letter] = true; 
            }); 
          });
          question.answerA = formatted_ans_obj.A;
          question.answerB = formatted_ans_obj.B;
          question.answerC = formatted_ans_obj.C;
          question.answerD = formatted_ans_obj.D;
        } 
      }

      // Starts the timer 
      // Called by start paper button on instruction modal
      function timer_start(){
        var duration = attempt.attempt.paper_info.duration; 
        // Set the 10 min reminder timeout
        $timeout(function(){$('#servantModal').modal('show');}, (duration - 600) * 1000);
        var time = duration;
        var hrs = ""; 
        var mins = "";
        var secs = "";
        var time_str = "";
        var time_disp = $('#timeo');
        function format_time(xx){
          if(xx < 10) return "0" + xx;
          else return xx; 
        }
        var timer = $interval(function(){
          time -= 1;
          hrs = format_time(Math.floor(time / 3600));
          mins = format_time(Math.floor(time % 3600 / 60));
          secs = format_time(time % 60);
          time_str = hrs + ":" + mins + ":" + secs;  // Avoiding seconds here
          if(time <= 10 * 60){    // Last 10 mins. Turn text to red
            time_disp.addClass('red'); 
          }
          if(time <= 1){
            time_disp.html("00:00");
            $interval.cancel(timer);
            $scope.alert_notification({msg:"TIME UP!", theme:"red", time: 10000});
            $('#cleanupModal').modal('show');
            $scope.finish();
          }
          time_disp.html(time_str); 
        },1000);
      }
      timer_start();

      // Question process pipeline; Also sets up the first question
      // Used by the init?
      // TODO instead of setting this as default, Let the first screen be a mock for INTRO.js
      $scope.setUpQuestions = function(){
        $scope.questions.forEach(function(question){
          if(question.ques_type === 'CH'){
            // Mark the next n questions as 'isChRelated = True'
            var lengthLinkedQuestions = question.comprehension_list.length;
            var currentIndex = $scope.questions.indexOf(question);
            for(var i=0; i<lengthLinkedQuestions; i++){
              $scope.questions[currentIndex + i + 1].isChRelated = true;
              $scope.questions[currentIndex + i + 1].chQuestion = question.question;
            }
            // Remove ch question from the array
            $scope.questions.splice($scope.questions.indexOf(question), 1);
          }
        });
        attempt.loadQuestionStatus()
        .then(function(resp){
          //console.log(resp);
          //$scope.status = resp.data;
          resp.data.forEach(function(ua){
            var qs = _.find($scope.questions,function(qs){return qs.id===ua.question});
            qs.useranswer = ua;
            qs.useranswer.isSubmitted=true;
            if(ua.answer != "null"){ qs.isAnswered = true;}
            if(qs.ques_type==="SC" ||  qs.ques_type==="SA"){
              qs.answer = ua.answer; 
            } else if (qs.ques_type === "IT"){
              qs.answer = parseInt(ua.answer)
            } else if (qs.ques_type === "MC" || qs.ques_type === "MT") {
              $scope.deserializeAndSetAnswer(qs, ua.answer); 
            }
          });
        },function(err){

        })
        // Set up the first question
        $scope.selectQuestion($scope.questions[0]);
      }


      //$scope.init(questions, status);

      // Manage timer for each question
      // Used by selectQuestion pipeline
      $scope.questionTimerManager = function(question){
        // Stop selectedQuestions timer.
        if($scope.selectedQuestion != undefined){
          //special case for first question
          clearInterval($scope.selectedQuestion.timerhandle);
        }
        // Start questions timer.
        if(question.timetaken === undefined){
          question.timetaken = 1; 
        }
        question.timerhandle = setInterval(function(){
          question.timetaken += 1;
        }, 1000);
      }

      // Question selection pipeline
      // Used by the index, nextQuestion and previousQuestion buttons
      // ! Manages timer for each question via questionTimerManager
      $scope.selectQuestion = function(question){
        if(question.useranswer === undefined){
          question.useranswer = {
            attempt: attempt.attempt.id,
            question: question.id,
            answer: "null",
            timetaken: question.timetaken 
          } 
        }
        $scope.questionTimerManager(question); 
        $scope.selectedQuestion = question;
      }

      // Select the next question. 
      // Used by "Next" button.
      $scope.nextQuestion = function(){
        var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
        if(currentIndex < $scope.questions.length - 1){
          $scope.selectQuestion($scope.questions[currentIndex + 1]);
        } else {
          $scope.selectedQuestion.isLast = true; 
          // TODO Disable the next button!
        }
      }

      // Select the previous question. 
      // Used by "Previous" control button.
      $scope.previousQuestion = function(){
        var currentIndex = $scope.questions.indexOf($scope.selectedQuestion); 
        if(currentIndex > 0){
          $scope.selectQuestion($scope.questions[currentIndex - 1]);
        } else {
          $scope.selectedQuestion.isFirst = true; 
          // TODO Disable the previous button!
        }
      }


      // Clear user selected/entered answer for the selectedQuestion
      // and syncs with the backend
      // Used by the "clear" control button
      $scope.clearAnswer = function(question){
        if(question.useranswer != undefined){
          var useranswerbackup = question.useranswer.answer;
          question.useranswer.answer = "null";
          question.useranswer.timetaken = question.timetaken;
          function success(resp){
            question.useranswer.answer = resp.answer;
            question.useranswer.isSubmitted = false;
            question.answer = undefined;
            question.answerA = undefined;
            question.answerB = undefined;
            question.answerC = undefined;
            question.answerD = undefined;
            question.isAnswered = false;
          }
          function failure(err){
            question.useranswer.answer = useranswerbackup;
            $scope.alert_notification({msg:"Couldn't connect to the server, please check your internet connection",theme:"red",time:3000});
          }
          //TODO Save/UPDATE LOGIC
          if(question.useranswer.isSubmitted != true){
            useranswer.saveAnswer(question.useranswer).then(success,failure);
          } else {
            useranswer.updateAnswer(question.useranswer).then(success, failure); 
          }
        } else {
          question.answer = undefined;
          question.answerA = undefined;
          question.answerB = undefined;
          question.answerC = undefined;
          question.answerD = undefined;
          question.isAnswered = false;
        }
      }

      // Set question.useranswer.answer if valid, else returns error string for alert
      // TODO No need to expose this to $scope!! 
      $scope.validateAndFormatAnswer = function(question){ 
        if (question.ques_type==='SC' || question.ques_type==='AR' || question.ques_type==='TF'){
          var validAnswers = ["A","B","C","D"];
          if (question.answer===undefined || !validAnswers.includes(question.answer)){
            return {msg:'Please select atleast one valid option', theme: 'red'};
          } else {
            question.useranswer.answer = question.answer;
            question.useranswer.timetaken = question.timetaken;
          }
        } else if (question.ques_type==='MC'){
          var ansList = [];
          var ansStr = "";
          var validAnswers = ["answerA", "answerB", "answerC", "answerD"];
          if(question.answerA != undefined || question.answerB != undefined 
              || question.answerC != undefined || question.answerD != undefined){
            validAnswers.forEach(function(va){
              if(question[va] === true) ansList.push(va[6]); //Push the last character A/B/C/D
              ansStr = ansList.toString();  // CSV String 
              question.useranswer.answer = ansStr;
              question.useranswer.timetaken = question.timetaken;
            });
          } else {
            return {msg:'Please select atleast one valid option', theme: 'red'};
          }

        } else if (question.ques_type==='MT'){
          var validAnswers = ["answerA", "answerB", "answerC", "answerD"];
          var validOptions = ["P", "Q", "R", "S"];
          var matrix_answer = { "A" : [], "B" : [], "C" : [], "D" : [] };
          if(question.answerA != undefined || question.answerB != undefined 
              ||question.answerC != undefined ||question.answerD != undefined){
            validAnswers.forEach(function(va){
              validOptions.forEach(function(vo){
                if(question[va] != undefined){
                  if(question[va][vo] === true){
                    matrix_answer[va.slice(-1)].push(vo)
                  }
                }
              });
            });
            console.log(matrix_answer);
            question.useranswer.answer = JSON.stringify(matrix_answer);
            question.useranswer.timetaken = question.timetaken;

          } else {
            return {msg:'Please select at least one valid answer', theme: 'red'}
          }

        } else if (question.ques_type==='IT'){
          if(question.answer === undefined) return {msg:'Please enter an Integer', theme:'red'};
          else {
            question.isAnswered = true; // Special case
            question.useranswer.answer = question.answer;
            question.useranswer.timetaken = question.timetaken;
          }

        } 

         else if (question.ques_type==='SA'){
          if(question.answer === undefined) return {msg:'Please write SOMETHING! ', theme:'red'};
          if(question.answer === "") return {msg:'Please write SOMETHING!', theme:'red'};
          else {
            question.useranswer.answer = question.answer;
            question.useranswer.timetaken = question.timetaken;
          }
        } 
        return true;
      }

      // Post answer to the backend if valid, else throw an alert. 
      // Used by the "save" control button.
      $scope.save = function(question){
        // Instantiate useranswer field if not present. Used to track previous attempts(?)
        var ques_valid = $scope.validateAndFormatAnswer(question); 

        if (ques_valid===true){
          if (!question.useranswer.isSubmitted){
            useranswer.saveAnswer(question.useranswer)
            .then(function(resp){
              $scope.alert_notification({msg: "Answer Saved.", theme:"green"});
              question.useranswer.answer = resp.answer;
              question.useranswer.id = resp.id;
              question.useranswer.isSubmitted = true;
            },function(err){
              $scope.alert_notification({msg:"Couldn't save your answer: Please check your internet connection!", theme:"red"});
            });
          } else {
            console.log("PUTTING!");
            useranswer.updateAnswer(question.useranswer)
            .then(function(resp){
              $scope.alert_notification({msg: "Answer Updated.", theme:"green", time:2000});
              question.useranswer.answer = resp.answer;
              question.useranswer.id = resp.id;
              question.useranswer.isSubmitted = true;
            },function(err){
              $scope.alert_notification({msg:"Couldn't update your answer: Please check your internet connection!", theme:"red"});
            });
          }
        } else {
          console.log(ques_valid);
          $scope.alert_notification(ques_valid);
        }
      };

      //Alerts and notifications
      $scope.notification_show = false;
      $scope.alert_notification = function (message){
        $scope.alert_message = message.msg;
        $scope.notification_show = true;
        $scope.alert_message_theme = message.theme;
        var timeout = message.time || 3000;
        $timeout(function(){
          $scope.alert_message_theme = "";
          $scope.alert_message = "";
          $scope.notification_show = false;
        }, timeout);
      }

      // Tooltips for buttons (bootstrap) 
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

      // Back and reload button handling
      // $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      //   if(confirm("The paper expires on " + "" + "You can come finish the paper before it expires. Do you really want to go back?")){
      //     $scope.$$listeners.$stateChangeStart = undefined;
      //     $scope.autoSave();
      //   } else {
      //     // TODO Retain the state
      //     console.log(event);
      //     event.preventDefault();
      //     //$window.location = $window.location.href;
      //   }
      //   return;
      //  });

      // For testing purposes
      // Used by the "info" control button
      $scope.displayInfo = function(){
        console.log($scope.selectedQuestion); 
      }
      // Use arrow keys for navigation
      $document.keyup(function(e){
        if(e.keyCode == 39) $scope.nextQuestion();
        else if (e.keyCode == 37) $scope.previousQuestion();
      })

      $scope.init(questions);
    }]);

