'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.paper
 * @description
 * # paper
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('paper', ['Restangular','$http',function (Restangular,$http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	var remote_papers = Restangular.all('spaper/');
	return {
		getAvailablePapers : function(){
			return remote_papers.getList(); 
		},
		getAttemptedPapers : function(){
			return remote_papers.getList();
		},
    getPaper : function(pid){
      return remote_papers.one(pid);
    }
	}    
  }]);
