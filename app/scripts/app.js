'use strict';

/**
 * @ngdoc overview
 * @name testingFrontendApp
 * @description
 * # testingFrontendApp
 *
 * Main module of the application.
 */
// Raven
//     .config('https://46caf5e31fa047eda91ce4112752aa2a@sentry.io/117038')
//     .addPlugin(Raven.Plugins.Angular)
//     .install();

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
    'chart.js',
    // 'ngRaven'
  ]);

// Redirect root to /home/
var rootState = {
  name :'root',
  resolve:{
    available_papers :['paper',function(paper){
      return paper.getAvailablePapers();
    }],
    user_attempts :['attempt',function(attempt){
      return attempt.loadAttempts();
    }]
  },
  url: "/",
  templateUrl: "views/home.html",
  controller:"HomeCtrl",
}

var homeState = {
  name :'home',
  // Params in case user was directed from edumate. These are used to get latest attempt
  // id and direct him to the results.
  params:{
    vid: null, // paper id
    vstate: null, // state to go to
  },
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
  // DO NOT REMOVE! Paper needs to be declared!
  params: {
    paper: null,
    pid: null
  },
  resolve:{
    questions : ['attempt','$stateParams','paper', function(attempt,$stateParams, paper){
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
    paper: ['$stateParams', function($stateParams){
      return $stateParams.paper;
    }]
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
  resolve:{
    // Latest attempt
    p_current_attempt_result : ['result','$stateParams',function(result,$stateParams){
      return result.getAttemptResult($stateParams.aid);
    }],
    // All attempts
    p_user_attempts :['attempt',function(attempt){
      return attempt.loadAttempts();
    }],
    // // Unreliable when abrupt state change or reload. REMOVE! TODO
    // p_current_paper: ['$stateParams', function($stateParams){
    //   return $stateParams.paper;
    // }]
  },
}

var solutionsState = {
  name: 'home.solutions',
  url: '/result/:aid/solutions',
  templateUrl: 'views/solutions.html',
  controller: 'SolutionsCtrl',
  params :{
    attempt: null,
    solutions: null,
  },
  resolve: {
    solutions: ['solutionsService','$stateParams',function(solutionsService, $stateParams){
      return solutionsService.getSolutions($stateParams.aid);
    }],
    attempt: ['$stateParams',function($stateParams){
      return $stateParams.attempt;
    }]
  }
}

testing_app.config(function($stateProvider,$urlRouterProvider) {
  	$stateProvider
    .state(rootState)
    .state(homeState)
    .state(attemptState)
    .state(resultState)
    .state(solutionsState);
  })

//if (window.location.hostname.indexOf('localhost')!=-1){
  //working on local server
  testing_app.constant('server',SERVER_URL);
//}

testing_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
	})
testing_app.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl(SERVER_URL);

    RestangularProvider.setDefaultHttpFields({
            'withCredentials': true
        });
	});
