'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('PaperCtrl', ['$scope','$state','Restangular','$rootScope','$http',
  function($scope,$state,Restangular,$rootScope,$http) {
    console.log($scope.paper);
    $scope.go2Home = function(){
    	$scope.toggleHome();
    	$state.go('home');
    };
    $scope.startAttempt = function(){
    	$scope.attempt = {};
    	$scope.attempt.paper = $scope.paper.id;
    	$scope.attempt.user = 1;
    	$scope.remote_attempt = Restangular.all('attempts/');
    	$scope.remote_attempt.post($scope.attempt)
    	.then(function(resp){
    		$scope.attempt = resp;
    		//now load the paper
            $http.get($rootScope.baseURL+'attempts/'+$scope.attempt.id+'/load_paper/')
            .then(function(resp){
                $scope.questions = resp.data;
                $state.go('home.paper.attempt');
            },function(err){
                //error
            });
    	},function(err){
    		console.log(err);
    	});
    };
  }]);
