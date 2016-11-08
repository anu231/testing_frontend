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
  	this.url = server+'/attemptmarks/';
    this.getAttemptResult = function(attemptId){
      //return $http.get(this.url+'1150');  
      return $http.get(this.url+attemptId);  
    }
    this.getAllAttemptResults = function(){
      return $http.get(this.url);
    }
  }]);
