'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.attempt
 * @description Should provide all actions related to attempt
 * including but not limited to starting new attempts, fetching ongoing
 * attempts, finishing attempts, getting questions, getting attempt results..
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
    /* Begins a new attempt on the specified paper id */
    this.startNewAttempt = function(paperId){
    	var data = {'paper':paperId,'user':1};
    	return $http.post(this.attempt_url,data);
    };
    /* ends the currently going on attempt */
    this.finishAttempt = function(){
    	this.attempt.finished = true;
    	return $http.put(this.attempt_url+this.attempt.id+'/finish/');
    };
    /*
    fetches the specified attempt from the server
    */
    this.fetchAttempt = function(att_id){
        console.log("fetching...");
        return $http.get(this.attempt_url+att_id+'/');
    }
    //Starts a new attempt or resumes an ongoing attempt
    this.startOrFetchAttempt = function(paper){
        console.log(paper);
        if(paper.status == "ongoing"){
          console.log("resuming..." + paper.ongoingAttempt);
          return this.fetchAttempt(paper.ongoingAttempt.id); 
        } else if(paper.status == "attempted" || paper.status == undefined){
          console.log("creating new...");
          return this.startNewAttempt(paper.id); 
        } else {
          alert("critical error: Couldn't start or resume attempt"); 
        }
    }
    /* Gets the info, status, score on the specified attempt. 
    If none specified then the current attempt */
    this.getAttempt = function(attmpt){
    	return this.attempt;
    };
    
    /* Saves the complete current attempt */
    //TODO Unnecessary
    this.saveAttempt = function(){

    };
    /* Saves the response for a specified question */
    //TODO Unnecessary
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
    this.autoSave = function(ua){
        return $http.post(this.attempt_url+this.attempt.id+'/save_answers/',{'ua':ua});
    }
  }]);
