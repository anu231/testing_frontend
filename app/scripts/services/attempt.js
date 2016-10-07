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
    var attempt = null;
    var attempt_url = '/attempts/';
    /* sets the specified attempt as the current attempt */
    setAttempt : function(attmpt){
    	attempt = attmpt;
    }
    /* Begins a new attempt on the specified paper */
    startAttempt :function(paper){
    	var attempt_data = {'paper':paper};
    	return $http.post(attempt_url,data);
    },
    /* ends the currently going on attempt */
    finishAttempt :function(){
    	attempt.finished = true;
    	return $http.post(attempt_url+'finish/');
    },
    /* Gets the info, status, score on the specified attempt. 
    If none specified then the current attempt */
    getAttempt : function(attmpt){
    	if (attmpt!=undefined){
    		attempt = attmpt;
    	}
    }
    /* Saves the complete current attempt */
    saveAttempt : function(){

    }
    /* Saves the response for a specified question */
    savePartialAttempt : function(){

    }
    /* loads the questions for the current attempt */
    loadQuestions : function(){

    }
  }]);
