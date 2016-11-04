'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.result
 * @description
 * # result
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('result', ['$http','server',function ($http, server) {

    this.getResultForAttemptId = function(attemptId){
      var resultUrl = server+'/attemptmarks/'+'1151/';
      //resultUrl = server+'/attemptmarks/'+attemptId+'/';
      return $http.get(server+'/attemptmarks/'+'1151/');  
    }
   
  }]);
