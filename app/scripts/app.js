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
    'snap',
    'chart.js'
  ]);

var homeState = {
  name :'home',
  resolve:{
    available_papers :['paper',function(paper){
      return paper.getAvailablePapers();
    }],
    user_attempts :['attempt',function(attempt){
      return attempt.loadAttempts();
    }]
  },
  url: "/home",
  templateUrl: "views/home.html",
  controller:"HomeCtrl",
}

var attemptState = {
  name:'home.attempt',
  resolve:{
    questions : ['attempt','$stateParams',function(attempt,$stateParams){
      //get all the questions and associated comprehension data
      //var paperid = $stateParams.pid;
      if (attempt.getAttempt()==null){
        attempt.fetchAttempt($stateParams.pid)
        .then(function(resp){
          attempt.setAttempt(resp.data);
          //return attempt.loadQuestions();
        },function(err){
          console.log(err);
        });
        return null;
      } else {
        return attempt.loadQuestions();  
      }
    }],
  },
  url:'/attempt/:pid',
  templateUrl:'views/attempt.html',
  controller:'AttemptCtrl'
}

var resultState = {
  name: 'home.result',
  url: '/result/:aid',
  templateUrl: 'views/result.html',
  controller: 'ResultCtrl',
  params: {
    aid: null,
    paper: null,
  },
  resolve:{
    p_current_attempt_result : ['result','$stateParams',function(result,$stateParams){
      return result.getLatestResult($stateParams.aid);
    }],
    p_user_attempts :['attempt',function(attempt){
      return attempt.loadAttempts();
    }],
    p_current_paper: ['$stateParams', function($stateParams){
      return $stateParams.paper;
    }]
  },
}

testing_app.config(function($stateProvider,$urlRouterProvider) {
  	$stateProvider
    .state(homeState)
    .state(attemptState)
    .state(resultState);
  })
testing_app.constant('server','http://192.168.1.19:8000');


testing_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	})
testing_app.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://192.168.1.19:8000/');
    RestangularProvider.setDefaultHttpFields({
            'withCredentials': true              
        });
	});
