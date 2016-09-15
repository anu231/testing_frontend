'use strict';

/**
 * @ngdoc overview
 * @name testingFrontendApp
 * @description
 * # testingFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('testingFrontendApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'restangular'
  ])
  .config(function($stateProvider,$urlRouterProvider) {
  	$stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
      controller:"HomeCtrl",
    })
    .state('home.paper', {
      url: "/paper",
      templateUrl: "views/paper.html",
      controller:"PaperCtrl",
    });

  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	});
