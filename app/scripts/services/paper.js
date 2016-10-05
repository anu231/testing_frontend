'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.paper
 * @description
 * # paper
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('paper', ['Restangular','$rootScope',function (Restangular,$rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	var remote_papers = Restangular.all($rootScope.baseURL+'/papers/');
	return {
		getAvailablePapers : function(){
			return; 
		},
		getAttemptedPapers : function(){
			return;
		}
	}    
  }]);
