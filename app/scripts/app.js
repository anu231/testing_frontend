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

var homeState = {
  name :'home',
  resolve:{
    available_papers :['paper',function(paper){
      return paper.getAvailablePapers();
    }],
    attempted_papers :['paper',function(paper){
      return paper.getAttemptedPapers();
    }]
  },
  url: "/home",
  templateUrl: "views/home.html",
  controller:"HomeCtrl",
}

var attemptState = {
  name:'home.attempt',
  resolve:{
    questions : ['$stateParams',function($stateParams){
      //get all the questions and associated comprehension data

    }],
  },
  url:'/attempt/:pid',
  templateUrl:'views/attempt.html',
  controller:'AttemptCtrl'
}

testing_app.config(function($stateProvider,$urlRouterProvider) {
  	$stateProvider
    .state(homeState);
  })



testing_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	})
testing_app.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://192.168.1.19:8000/');
	});
