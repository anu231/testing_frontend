'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.attempt
 * @description
 * # attempt
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('attempt', ['$http','server',function ($http,server) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.attempt = null;
    this.attempt_url = server+'/attempts/';
    /* sets the specified attempt as the current attempt */
    this.setAttempt = function(attmpt){
    	this.attempt = attmpt;
    };
    /* Begins a new attempt on the specified paper */
    this.startAttempt = function(paper){
    	var data = {'paper':paper,'user':1};
    	return $http.post(this.attempt_url,data);
    };
    /* ends the currently going on attempt */
    this.finishAttempt = function(){
    	attempt.finished = true;
    	return $http.post(attempt_url+'finish/');
    };
    /*
    fetches the specified attempt from the server
    */
    this.fetchAttempt = function(att_id){
        return $http.get(this.attempt_url+att_id+'/');
    }
    /* Gets the info, status, score on the specified attempt. 
    If none specified then the current attempt */
    this.getAttempt = function(attmpt){
    	return this.attempt;
    };
    /* Saves the complete current attempt */
    this.saveAttempt = function(){

    };
    /* Saves the response for a specified question */
    this.savePartialAttempt = function(){

    }
    /* loads the questions for the current attempt */
    this.loadQuestions = function(){
        return $http.get(this.attempt_url+this.attempt.id+'/load_paper/');
    };
    this.loadQuestionStatus = function(){
        return $http.get(this.attempt_url+this.attempt.id+'/get_question_states/');
    };
    this.loadAttempts = function(){
        return $http.get(this.attempt_url+'get_attempts/');
    }
  }]);
