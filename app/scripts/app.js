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
  // (Latest)attempt ID and paper MUST be passed.
  params: {
    aid: null,
    paper: null,
  },
  resolve:{
    // Latest attempt
    p_current_attempt_result : ['result','$stateParams',function(result,$stateParams){
      return result.getAttemptResult($stateParams.aid);
    }],
    // All attempts
    p_user_attempts :['attempt',function(attempt){
      return attempt.loadAttempts();
    }],
    // Unreliable when abrupt state change or reload. REMOVE! TODO
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

if (window.location.hostname.indexOf('192.168')!=-1){
  //working on local server
  testing_app.constant('server','http://192.168.1.19:8000');
} else {
  testing_app.constant('server','http://educonnect/');
}

testing_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	})
testing_app.config(function(RestangularProvider) {
    if (window.location.hostname.indexOf('192.168')!=-1){
      //working on local server
      RestangularProvider.setBaseUrl('http://192.168.1.19:8000/');  
    } else {
      RestangularProvider.setBaseUrl('http://educonnect/');
    }
    
    RestangularProvider.setDefaultHttpFields({
            'withCredentials': true              
        });
	});
