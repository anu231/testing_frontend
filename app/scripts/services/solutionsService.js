'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.solutions
 * @description
 * # solutions
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('solutionsService', ['$http', 'server',
  function ($http, server) {
    this.solution_url = server + 'attempts/';
    this.paper_solution_url = server +'spaper/';
    this.getSolutions = function(aid,attempt_solution){
      if (attempt_solution){
      	return $http.get(this.solution_url + aid + '/get_solutions/');	
      } else {
      	return $http.get(this.paper_solution_url + aid + '/get_solutions/');
      }
    }
  }]);
