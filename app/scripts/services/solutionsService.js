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
    this.getSolutions = function(aid){
      return $http.get(this.solution_url + aid + '/get_solutions/');
    }
  }]);
