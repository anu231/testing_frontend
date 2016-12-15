'use strict';

describe('Controller: AttemptCtrl', function () {

  // load the controller's module
  beforeEach(module('testingFrontendApp'));

  var AttemptCtrl,
    $scope,
    scope,
    attempt,
    questions,
    useranswer,
    paper;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // List of questions resolved before route
    questions = {
      data: [{
        "id": 1,
        "ques_type": "SC",
        "question": "Question 1",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "1",
        "comprehension_list": null,
        "subj": "Chemistry"
      }, {
        "id": 2,
        "ques_type": "MC",
        "question": "Question 2",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Math"
      }, {
        "id": 3,
        "ques_type": "IT",
        "question": "Question 3",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Physics"
      }, {
        "id": 4,
        "ques_type": "MT",
        "question": "Question 4",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Chemistry"
      }, {
        "id": 5,
        "ques_type": "CH",
        "question": "Question 5",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": [6, 7],
        "subj": "Chemistry"
      }, {
        "id": 6,
        "ques_type": "SC",
        "question": "Question 6",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Chemistry"
      }, {
        "id": 7,
        "ques_type": "MC",
        "question": "Question 7",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Chemistry"
      }, {
        "id": 8,
        "ques_type": "AR",
        "question": "Question 9",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "4",
        "comprehension_list": null,
        "subj": "Chemistry"
      }, ]
    };
    // Attempt service mock
    attempt = {
      attempt: {
        "id": 31,
        "paper_info": {
          "id": 1,
          "name": "YSNP",
          "maxmarks": 720,
          "duration": "10800.0"
        },
        "starttime": "2016-12-08T12:05:55.405395Z",
        "endtime": "2016-12-08T12:10:58.229946Z",
        "finished": false,
        "score": null,
        "valid": true,
        "user": 1009,
        "paper": 1
      },
      loadQuestions: function () {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve({
              data: [{
                "id": 1,
                "ques_type": "SC",
                "question": "Question 1",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "1",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, {
                "id": 2,
                "ques_type": "MC",
                "question": "Question 2",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Math"
              }, {
                "id": 3,
                "ques_type": "IT",
                "question": "Question 3",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Physics"
              }, {
                "id": 4,
                "ques_type": "MT",
                "question": "Question 4",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, {
                "id": 5,
                "ques_type": "CH",
                "question": "Question 5",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, {
                "id": 6,
                "ques_type": "SC",
                "question": "Question 6",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, {
                "id": 7,
                "ques_type": "MC",
                "question": "Question 7",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, {
                "id": 8,
                "ques_type": "AR",
                "question": "Question 9",
                "ans1": "A",
                "ans2": "B",
                "ans3": "C",
                "ans4": "D",
                "layout": "4",
                "comprehension_list": null,
                "subj": "Chemistry"
              }, ]
            })
          } else {
            reject("couldn-t fetch questions")
          }
        })
      },
      loadQuestionStatus: function () {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve({
              data: [{
                "id": 11,
                "answer_key": "A",
                "answer": "A",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:11",
                "attempt": 1,
                "question": 1
              }, {
                "id": 21,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 2
              }, {
                "id": 31,
                "answer_key": "12",
                "answer": "12",
                "score": null,
                "submitted": false,
                "timetaken": "00:01:04",
                "attempt": 1,
                "question": 3
              }, {
                "id": 41,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 4
              }, {
                "id": 51,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 5
              }]
            })
          } else {
            reject("Error, couldn't get status")
          }
        });
      },
      autoSave: function (autosave_ua) {
        return new Promise(function (resolve, reject) {
          if (autosave_ua) {
            resolve({
              data: [{
                "id": 11,
                "answer_key": "A",
                "answer": "A",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:11",
                "attempt": 1,
                "question": 1
              }, {
                "id": 21,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 2
              }, {
                "id": 31,
                "answer_key": "12",
                "answer": "12",
                "score": null,
                "submitted": false,
                "timetaken": "00:01:04",
                "attempt": 1,
                "question": 3
              }, {
                "id": 41,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 4
              }, {
                "id": 51,
                "answer_key": "A,B,C",
                "answer": "A,B,C",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:06",
                "attempt": 1,
                "question": 5
              }]
            })
          } else {
            reject({
              error: true
            })
          }
        })
      },
      finishAttempt: function () {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve({
              status: 200
            })
          } else {
            reject({
              status: 400
            })
          }
        })
      },
      generate_marks: function () {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve();
          } else {
            reject("Error couldn't generate marks")
          }
        })
      }
    };
    // Useranswer service mock
    useranswer = {
      saveAnswer: function (userans) {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve({
              data: {
                "id": 11,
                "answer_key": "A",
                "answer": "A",
                "score": null,
                "submitted": false,
                "timetaken": "00:00:11",
                "attempt": 1,
                "question": 1
              }
            })
          } else {
            reject("Couldn't save answer")
          }
        })
      },
      updateAnswer: function (userans) {
        return new Promise(function (resolve, reject) {
          if (1 == 1) {
            resolve({
              data: {
                data: {
                  "id": 11,
                  "answer_key": "A",
                  "answer": "A",
                  "score": null,
                  "submitted": false,
                  "timetaken": "00:00:11",
                  "attempt": 1,
                  "question": 1
                }
              }
            })
          } else {
            reject("Couldn't update answer")
          }
        })
      }
    };


    AttemptCtrl = $controller('AttemptCtrl', {
      $scope: scope,
      questions: questions,
      attempt: attempt,
      useranswer: useranswer,
      paper: paper
    });
  }));


  /* TESTS START */

  describe("The $scope.init function", function () {
    var called;
    beforeEach(function () {
      $scope = scope;
      questions = questions;
      called = false;
    })

    it('should set the appropriate paper title', function () {
      expect($scope.paper_title).toBe('YSNP');
    });

    it('should setUpQuestions IF questions NOT null', function () {
      expect($scope.questions).toBe(questions.data);
    });

    it('should loadQuestions IF questions are null', function () {
      $scope.init(null); // Init with no questions should load questions none the less
      expect($scope.questions).toBe(questions.data);
    });

    xit('should start the timer', function () {
      $scope.init(null);
      expect(true).toBe(true);
    });

  });

  xdescribe('The $scope.autoSave function', function () {
    beforeEach(function () {
      $scope = scope,
        questions = questions
    })

    it('should autoSave', function () {
      questions[1].
      $scope.autoSave();
      expect(1).toBe(2);
    });

    it('should call attempt.autosave()', function () {
      expect(1).toBe(2);
    });

    it('should parse and deserialize responses', function () {
      expect(1).toBe(2);
    });

  });

  describe('The finish function', function () {
    var called = false;
    var alerted = false;
    beforeEach(function () {
      $scope = scope;
      called = false;
      alerted = false;
    });

    it('should call $scope.autosave()', function () {
      $scope.autoSave = function () {
        called = true;
      }
      $scope.finish();
      expect(called).toBe(true);
    });

    // TODO: Add modal tests
    it('should call attempt.finishAttempt()', function () {
      attempt.finishAttempt = function () {
        return new Promise(function (resolve, reject) {
          called = true;
          resolve({
            status: 200
          })
        })
      }
      $scope.finish();
      expect(called).toBe(true);
    });

    // TODO
    xit('should alert on errors', function () {
      var alert = function(msg){
        alerted = true;
      }
      $scope.finish();
      expect(alerted).toBe(true);
    });
  });

  describe('The $scope.deserializeAndSetAnswer function', function () {
    var question;
    beforeEach(function(){
      $scope = scope;
      question = {
        "id": 1,
        "ques_type": "",
        "question": "Question 1",
        "ans1": "A",
        "ans2": "B",
        "ans3": "C",
        "ans4": "D",
        "layout": "1",
        "comprehension_list": null,
        "subj": "Chemistry"
      }
    });

    it('should deserialize set the proper MC answer string [1]', function () {
      question.ques_type = "MC";
      var ans_str = "a, B,d"
      $scope.deserializeAndSetAnswer(question, ans_str);
      expect(question.answerA).toBe(true);
      expect(question.answerB).toBe(true);
      expect(question.answerC).not.toBe(true);
      expect(question.answerD).toBe(true);
    });

    it('should deserialize set the proper MC answer string [2]', function () {
      question.ques_type = "MC";
      var ans_str = "  d  "
      $scope.deserializeAndSetAnswer(question, ans_str);
      expect(question.answerA).not.toBe(true);
      expect(question.answerB).not.toBe(true);
      expect(question.answerC).not.toBe(true);
      expect(question.answerD).toBe(true);
    });
    it('should deserialize set the proper MT answer string [1]', function () {
      question.ques_type = "MT";
      var ans_str = '{"A":["P"," S"],"B": ["R"],"C":[],"D":["R","P"]}';
      $scope.deserializeAndSetAnswer(question, ans_str);
      expect(question.answerA.P).toBe(true);
      expect(question.answerA.S).toBe(true);
      expect(question.answerB.R).toBe(true);
      expect(question.answerC).not.toBe(true);
      expect(question.answerD.R).toBe(true);
      expect(question.answerD.P).toBe(true);
    });
    it('should deserialize set the proper MT answer string [2]', function () {
      question.ques_type = "MT";
      var ans_str = '{"A":[" S"],"B": ["R"],"C":[],"D":["R","P"]}';
      $scope.deserializeAndSetAnswer(question, ans_str);
      expect(question.answerA.P).not.toBe(true);
      expect(question.answerA.Q).not.toBe(true);
      expect(question.answerA.R).not.toBe(true);
      expect(question.answerA.S).toBe(true);
      expect(question.answerB.R).toBe(true);
      expect(question.answerC).not.toBe(true);
      expect(question.answerD.R).toBe(true);
      expect(question.answerD.P).toBe(true);
    });
  });

  // TODO
  xdescribe('The timer_start function', function () {
    it('should set the proper remaining time', function () {
      expect(1).toBe(2);
    });
    it('should set the 10 minute timeout reminder', function () {
      expect(1).toBe(2);
    });
    it('should format time properly', function () {
      expect(1).toBe(2);
    });
  });

  // TODO
  xdescribe('The setUpQuestions function', function () {
    beforeEach(function(){
      $scope = scope,
      questions = questions
    });
    it('should remove CH question and mark its children and remove the CH question', function () {
      // Note: the reduced indices indicate that CH( index 5) was removed
      expect(questions.data[4].isChRelated).toBe(true);
      expect(questions.data[5].isChRelated).toBe(true);
    });

    it('should load the question statuses ', function () {
      expect(1).toBe(2);
    });

    it('should set the proper answer. Call deserializeAndSetAnswer() if needed', function () {
      expect(1).toBe(2);
    });

    it('should set selectedQuestion to first question', function () {
      expect($scope.selectedQuestion).toBe(questions.data[0]);
    });
  });

  describe('The questionTimerManager function', function () {
    var question = {};
    beforeEach(function(){
      $scope=scope,
      questions = questions;
    });

    it('should initialize question timer IF undefined', function () {
      question.timetaken = undefined;
      $scope.questionTimerManager(question)
      expect(question.timetaken).not.toBe(undefined);
      expect(question.timetaken).not.toBe("");
    });

    it('should set the timerhandle and interval on the question', function () {
      expect($scope.selectedQuestion.timetaken).not.toBe(undefined);
      expect($scope.selectedQuestion.timerhandle).not.toBe(undefined);
      $scope.nextQuestion(); // Change questions a few times
      expect($scope.selectedQuestion.timetaken).not.toBe(undefined);
      expect($scope.selectedQuestion.timerhandle).not.toBe(undefined);
      $scope.nextQuestion();
      expect($scope.selectedQuestion.timetaken).not.toBe(undefined);
      expect($scope.selectedQuestion.timerhandle).not.toBe(undefined);
    });

    it('should stop the timer if a different question is selected', function () {
      var previousQuestion = $scope.selectedQuestion;
      var previousQuestionTime = previousQuestion.timetaken;
      $scope.nextQuestion(); // Change questions a few times
      $scope.nextQuestion();
      expect(previousQuestion.timetaken).toBe(previousQuestionTime);
    });
  });

  describe('The selectQuestion function', function () {
    var called = false;
    var question;
    beforeEach(function(){
      $scope = scope,
      questions = questions;
      called = false;
    });

    it('should set the question.useranswer obj if not done already', function () {
      question = questions.data[1] // Get a question
      expect(question.useranswer).toBe(undefined);
      $scope.selectQuestion(question);
      expect(question.useranswer).toBe.defined;
      expect(question.useranswer.attempt).toBe(attempt.attempt.id);
      expect(question.useranswer.question).toBe(question.id);
      expect(question.useranswer.answer).toBe("null"); // "null" string. NOT null keyword
      expect(question.useranswer.timetaken).toBe(undefined); // Set later

    });

    it('should pass the question to questionTimerManager()', function () {
      var question = questions.data[1]
      $scope.selectQuestion(question);
      expect($scope.selectedQuestion.timetaken).not.toBe(undefined);
      expect($scope.selectedQuestion.timerhandle).not.toBe(undefined);
    });

    it('should set the $scope.selectedQuestion to argument question', function () {
      var question = questions.data[1]
      $scope.selectQuestion(question);
      expect($scope.selectedQuestion).toBe(question);
    });
  });

  describe('The nextQuestion function', function () {
    beforeEach(function(){
      $scope = scope,
      questions = questions;
    })
    it('should pass the next question object to the $scope.selectQuestion()', function () {
      var q1 = questions.data[1];
      var q2 = questions.data[2];
      $scope.selectQuestion(q1);
      $scope.nextQuestion();
      expect($scope.selectedQuestion).toBe(q2); // Implies that $scope.selectQUestion is called

    });
  });

  describe('The previousQuestion function', function () {
    it('should pass the previous question to the $scope.selectQuestion()', function () {
      beforeEach(function () {
        $scope = scope,
          questions = questions;
      })
      it('should pass the next question object to the $scope.selectQuestion()', function () {
        var q1 = questions.data[1];
        var q2 = questions.data[2];
        $scope.selectQuestion(q2);
        $scope.previousQuestion();
        expect($scope.selectedQuestion).toBe(q1); // Implies that $scope.selectQUestion is called

      });
    });
  });

  describe('The clearAnswer function', function () {
    var question;
    beforeEach(function(){
      $scope = scope;
      questions = questions;
    })
    it('should set all answer properties (answerA, answerB...) on question to\
       undefined, and set question.isAnswered to false IF question.useranswer is undefined', function () {
      question = questions.data[1];
      question.useranswer = undefined;
      $scope.clearAnswer(question);
      expect(question.answer).toBe(undefined);
      expect(question.answerA).toBe(undefined);
      expect(question.answerB).toBe(undefined);
      expect(question.answerC).toBe(undefined);
      expect(question.answerD).toBe(undefined);
      expect(question.isAnswered).toBe(false);
    });

    it('should do its thing if question.useranswer is NOT undefined', function () {
      question = questions.data[1];
      // Random BS
      question.useranswer = {
        answer: "A,D",
        isSubmitted:false
      }
      question.answer = 1;
      question.answerA = true;
      question.answerB = {"A": {"P": true, "Q": true}, "C":{"S": true}};
      question.answerC = false;
      question.answerD = true;
      $scope.clearAnswer(question);
      // Note: Delayed by 1 sec cuz clearAnswer is async...
      setTimeout(function () {
        expect(question.answer).toBe(undefined);
        expect(question.answerA).toBe(undefined);
        expect(question.answerB).toBe(undefined);
        expect(question.answerC).toBe(undefined);
        expect(question.answerD).toBe(undefined);
        expect(question.isAnswered).toBe(false);
      }, 1000)

      });

  });

  describe('The validateAndFormatAnswer function', function () {
    var question;
    beforeEach(function(){
      $scope = scope;
      questions = questions;
    });

    it('should return a notification object if question.answer is empty', function () {
      question = questions.data[1];
      var a = $scope.validateAndFormatAnswer(question)
      var b = {msg: 'Please select atleast one valid option', theme: 'red'};
      expect(a.msg).toBe(b.msg);
    });

    it('should set the format the answer correctly for SC and AR types', function () {
      question = questions.data[0]; // SC type
      $scope.selectQuestion(question);  // selectQuestion to initialize
      question.answer = "A"; // Option A selected
      $scope.validateAndFormatAnswer(question)
      expect(question.useranswer.answer).toBe(question.answer);
      question.answer = "AB"; // Option A selected
      var resp = $scope.validateAndFormatAnswer(question)
      expect(resp.msg).toBe('Please select atleast one valid option');
    });

    it('should set the format the answer correctly for MC type', function () {
      question = questions.data[1]; // MC type
      $scope.selectQuestion(question);  // selectQuestion to initialize
      question.answerA = true;
      question.answerB = true;
      question.answerC = true;
      $scope.validateAndFormatAnswer(question)
      expect(question.useranswer.answer).toBe("A,B,C");

      // Unanswered is undefined and not false!
      question.answerA = undefined;
      question.answerB = undefined;
      question.answerC = undefined;
      var resp = $scope.validateAndFormatAnswer(question)
      expect(resp.msg).toBe('Please select atleast one valid option');
    });

    it('should set the format the answer correctly for MT type', function () {
      question = questions.data[3]; // MT type
      $scope.selectQuestion(question);  // selectQuestion to initialize
      question.answerA = {"P":true, "Q":true};
      question.answerB = {"P":undefined};
      question.answerC = {"T": undefined, "S": true};
      $scope.validateAndFormatAnswer(question);
      expect(question.useranswer.answer).toBe('{"A":["P","Q"],"B":[],"C":["S"],"D":[]}');

      question = questions.data[3]; // MT type
      $scope.selectQuestion(question);  // selectQuestion to initialize
      question.answerA = {"P":undefined, "Q":undefined};
      question.answerB = {"P":undefined};
      question.answerC = {"T": undefined, "S": undefined};
      $scope.validateAndFormatAnswer(question);
      expect(question.useranswer.answer).toBe('{"A":[],"B":[],"C":[],"D":[]}');
    });

    it('should set the format the answer correctly for IT', function () {
      question = questions.data[2]; // IT type
      $scope.selectQuestion(question);
      question.answer = 12;
      $scope.validateAndFormatAnswer(question);
      expect(question.useranswer.answer).toBe(12);

    });

    xit('should set the format the answer correctly for SA type', function () {
      expect(1).toBe(2);
    });
  });

  describe('The save function', function () {
    var called = false;
    beforeEach(function(){
      $scope = scope,
      questions = questions;
      called = false;

      $scope.validateAndFormatAnswer = function(){
        called = true;
        return true;
      }
      $scope.alert_notification = function(a){
        called = true;
      }

      useranswer.saveAnswer = function(a){
        called = true;
        return new Promise(function(resolve,reject){
          resolve({answer: "POST"})
        });

      }
      useranswer.updateAnswer = function(a){
        called = true;
        return new Promise(function(resolve,reject){
          resolve({answer: "PUT"})
        });

      }
    })

    it('should get the formatted answer from the validateAndFormatAnswer()', function () {
      var question = questions.data[0];
      $scope.save(question);
      expect(called).toBe(true);
    });

    it('should POST the question.useranswer via useranswer.saveAnswer() if it is valid\
      and if never saved before', function () {
      var question = questions.data[0]; // SC
      question.answer = "A";
      $scope.save(question);
      expect(called).toBe(true);
      setTimeout(() => {
        expect(question.useranswer.answer).toBe("POST");
      }, 1000)
    });

    it('should PUT the question.useranswer via useranswer.updateAnswer() if it is valid\
      and saved before', function () {
      var question = questions.data[0]; // SC
      question.answer = "A";
      question.isSavedOnce = true;
      $scope.save(question);
      expect(called).toBe(true);
      setTimeout(() => {
        expect(question.useranswer.answer).toBe("PUT");
      }, 1000)
    });
    it('should call the alert_notificaton if validateAndFormatAnswer failed', function () {
      var question = questions.data[0]; // SC
      $scope.save(question);
      expect(called).toBe(true);
    });
  });


});
