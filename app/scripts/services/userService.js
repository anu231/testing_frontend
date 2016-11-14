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
      logout : function(){
        // Logout from educonnect; if successful, log out of django server
        $http.get(EDUCONNECT_LOGOUT_URL).then(function(resp){
          $http.get(server + DJANGO_LOGOUT_ENDPOINT)
          console.log("logging out");
        }, function(err){
          console.log(err);
          alert("COULDN'T LOG YOU OUT")
        })
      }
    }
  }]);
