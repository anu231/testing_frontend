'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.useranswer
 * @description
 * # useranswer
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('useranswer', ['Restangular','attempt',function (Restangular,attempt) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var remote_userans = Restangular.all('/userans/');
    return {
    	saveAnswer : function(question){
    		return remote_userans.post({
    			'attempt':attempt.attempt.id,
    			'question':question.id,
    			'answer':question.answer,
    			'timetaken':question.time
    		});
    	}
    };
  }]);
