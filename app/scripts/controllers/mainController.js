'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('MainCtrl',['$state','$rootScope','$scope', 'userService', '$timeout', '$window','moodle',
  	function ($state,$rootScope,$scope, userService, $timeout, $window,moodle) {
    $scope.init = function(){
    	//$rootScope.baseURL = 'http://localhost:8000/';
    	//$scope.uirouterDebug();
    $scope.notification_show = false;
    $scope.alert_notification = function (message){
        $scope.alert_message = message.msg;
        $scope.notification_show = true;
        $scope.alert_message_theme = message.theme;
        var timeout = message.time || 3000;
        $timeout(function(){
          $scope.alert_message_theme = "";
          $scope.alert_message = "";
          $scope.notification_show = false;
        }, timeout);
    }

		userService.getUserInfo().then(function(resp){
        	if( resp.data.result == 0 ){
	          // Redirect for authnetication
	          //alert("Error You are not logged in / authorized! Please log in to continue");
	          //$timeout(function(){$window.location.href="http://www.raoeduconnect.com"}, 3000);
	          //window.location.href = moodle + 'portal_sso_auth.php';
            }
            $scope.username = resp.data.fname
            /*Raven.setUserContext({
                name: resp.data.fname,
                email: resp.data.name  // Poor naming conventions :(
            });*/

            // Here we check whether the user has been redirected from edumate.
            // If so, resolve the parameters and then take appropriate action
            var queryDict = {}
            location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
            console.log(queryDict);
            if (queryDict['pid'] != undefined){
                $state.go('paper',{pid:queryDict['pid']});
            }else {
                var hash = document.location.hash;
                var items = hash.replace('#/', '').replace('?', '').split('&');
                var vstate, vid;
                items.forEach(function(item){
                    if(item.match(/state=(\w+)/))
                        vstate = item.match(/state=(\w+)/)[1];
                    if(item.match(/id=(\w+)/))
                        vid = item.match(/id=(\w+)/)[1];
                });
                if(vid && vstate)
                    $state.go('home', {vid: vid, vstate: vstate});
                else if(hash != ''){}
                else
                    $state.go('home');
            }
        }, function(err){
            console.log(err);
            Raven.captureException(err,{
                level: 'info',
                logger: 'MainCtrl',
                extra:{
                    reason: 'no credentials so logged out and redirected'
                }
            });
            alert("Error You are not logged in / authorized! Please log in to continue");
            //$timeout(function(){$window.location.href=moodle}, 3000);
        });

        $scope.logout = function(){
            userService.logout();
        }
    };
    $scope.uirouterDebug = function(){
    	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
		  console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
		});
		$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
		  console.log('$stateChangeError - fired when an error occurs during transition.');
		  console.log(arguments);
		});
		$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
		  console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
		});
		$rootScope.$on('$viewContentLoading',function(event, viewConfig){
		   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
		});
		// $rootScope.$on('$viewContentLoaded',function(event){
		//   // runs on individual scopes, so putting it in "run" doesn't work.
		//   console.log('$viewContentLoaded - fired after dom rendered',event);
		//});
		$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
		  console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
		  console.log(unfoundState, fromState, fromParams);
		});
    };
    $scope.init();
  }]);
