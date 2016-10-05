'use strict';

/**
 * @ngdoc overview
 * @name testingFrontendApp
 * @description
 * # testingFrontendApp
 *
 * Main module of the application.
 */
var testing_app = angular
  .module('testingFrontendApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'snap'
  ]);

testing_app.config(function($stateProvider,$urlRouterProvider) {
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
    })
    .state('home.paper.attempt', {
      url: "/attempt",
      templateUrl: "views/attempt.html",
      controller:"AttemptCtrl",
    });

  })

var homeState = {
  name :'home',
  resolve:{
    availbale_papers :['paper',function(paper){
      return paper.getAvailablePapers();
    }],
    attemtped_papers :['paper',function(paper){
      return paper.getAttemptedPapers();
    }]
  },
  url: "/home",
  templateUrl: "views/home.html",
  controller:"HomeCtrl",
}

testing_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	})
testing_app.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:8000/');
	});
