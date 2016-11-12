'use strict';

/**
 * @ngdoc service
 * @name testingFrontendApp.userService
 * @description
 * # userService
 * Service in the testingFrontendApp.
 */
angular.module('testingFrontendApp')
  .service('userService', function () {
    var remote_user = Restangular.all('authenticate');
    return{
      getUserInfo : function(){
        // Get information of the user logged in
        return remote_user.get();
      },
      userLogout : function(){
        // TODO log out user.
      }
    }
  });
