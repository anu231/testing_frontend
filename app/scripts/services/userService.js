'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.userService
 * @description
 * # userService
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('userService',['$http','server', function($http, server) {
    return{
      getUserInfo : function(){
        // Get information of the user logged in
        return $http.get(server + 'authenticate/')
      },
      userLogout : function(){
        // TODO log out user.
        return remote_user;
      }
    }
  }]);
