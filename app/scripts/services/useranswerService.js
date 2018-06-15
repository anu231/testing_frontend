'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.useranswer
 * @description
 * # useranswer
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('useranswer', ['Restangular','attempt', '$http','server', function (Restangular,attempt,$http,server) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var remote_userans = Restangular.all('/userans/');
    return {
    	saveAnswer : function(userans){
    		//return remote_userans.post(userans);
            return $http.post(server+'attempts/'+userans.attempt+'/save_answer/',userans);
    	},
    	updateAnswer : function(userans){
    		return remote_userans.customPUT(userans,userans.id+'/');
    	}
    };
  }]);
