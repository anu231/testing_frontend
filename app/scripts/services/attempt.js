'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.attempt
 * @description
 * # attempt
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('attempt', ['$http',function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.attempt = null;
    this.attempt_url = '/attempts/';
    /* sets the specified attempt as the current attempt */
    this.setAttempt = function(attmpt){
    	this.attempt = attmpt;
    };
    /* Begins a new attempt on the specified paper */
    this.startAttempt = function(paper){
    	var attempt_data = {'paper':paper};
    	return $http.post(this.attempt_url,data);
    };
    /* ends the currently going on attempt */
    this.finishAttempt = function(){
    	attempt.finished = true;
    	return $http.post(attempt_url+'finish/');
    };
    /* Gets the info, status, score on the specified attempt. 
    If none specified then the current attempt */
    this.getAttempt = function(attmpt){
    	if (attmpt!=undefined){
    		this.attempt = attmpt;
    	}
    };
    /* Saves the complete current attempt */
    this.saveAttempt = function(){

    };
    /* Saves the response for a specified question */
    this.savePartialAttempt = function(){

    }
    /* loads the questions for the current attempt */
    this.loadQuestions = function(){

    };
  }]);
