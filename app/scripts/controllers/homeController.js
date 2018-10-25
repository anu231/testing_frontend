'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('HomeCtrl', ['$scope','$state','available_papers','user_attempts','$uibModal','attempt','userService','$timeout','$window','$interval', '$stateParams', '$rootScope',
    function ($scope,$state,available_papers,user_attempts,$uibModal,attempt, userService,$timeout, $window, $interval, $stateParams, $rootScope) {
      document.title = "RaoEduconnect Test Portal: Home";
      $scope.available_papers = available_papers;
      $scope.user_attempts = user_attempts.data;
      // Log if no papers available papers for the user
      if($scope.available_papers.length == 0){
        Raven.captureMessage("No available papers for user",{
          logger: 'HomeCtrl',
          level: 'error'
        });
      }

      $scope.init = function () {
        //Does initial book keeping for the attempted papers
        for (var i=0; i<$scope.user_attempts.length; i++){
          var p = _.find($scope.available_papers,function(a){return a.id==$scope.user_attempts[i].paper_info.id});
          // Skip papers with no attempts
          if(! p){
            Raven.captureMessage("Paper for attempts not available.",{
              logger: 'HomeCtrl',
              level: 'error',
              extra: {
                user_attempt: $scope.user_attempts[i]
              }
            });
            continue;
          }
          // Array containing all attempts for a paper
          if(p['allAttempts'] != undefined){
            p['allAttempts'].push($scope.user_attempts[i]);
          } else {
            p['allAttempts'] = [];
            p['allAttempts'].push($scope.user_attempts[i]);
          }
          if ($scope.user_attempts[i].finished!=true) {
            p['status'] = 'ongoing';
            p['ongoingAttempt'] = $scope.user_attempts[i];
            p['attemptStartTime'] = $scope.user_attempts[i].starttime;
            $scope.setOngoingTimer(p); // Sets the live ongoing-remaining timer on paper
          } else {
            p['status'] = 'attempted';
          }
        }
        // Marks papers if Expired
        $scope.available_papers.forEach(function(paper) {
          paper.startdate_formatted = new Date(paper.startdate);
          if($scope.isExpired(paper)) paper['isExpired'] = true;
          if (paper.offline && $scope.show_paper_solution(paper)){paper['show_solution']=true;}
        });
      }

      // Checks whether a paper is expired
      // Used in init
      $scope.isExpired = function(paper){
        var last_date = new Date(paper.lastdate);
        var today = new Date();
        var delta = (last_date - today);
        if(delta <= 0) return true;
        else return false;
      }
      //decides whether to show the paper's solution or not
      $scope.show_paper_solution = function(paper){
        var start_date = new Date(paper.soln_show_date);
        var today = new Date();
        //start_date.setHours(19);
        if (today>start_date){
          return true;
        } else {
          return false;
        }
      }
      // Get appropriate local date string
      $scope.getTzDate = function(time_str){
        var d = new Date(time_str);
        var date = d.toLocaleDateString();
        return date
      }

      // Get appropriate local time string
      $scope.getTzTime = function(time_str){
        var d = new Date(time_str);
        var time = d.toLocaleTimeString().slice(0,5);
        return time
      }

      // Returns formatted time remaining for ongoing papers
      $scope.getRemainingTime = function(paper){
        var st = new Date(paper.attemptStartTime);
        var now = new Date();
        var time_passed = Math.floor((now - st)/1000);
        var splits = paper.time.split(':');
        var duration = splits[0] * 3600 + splits[1] * 60;
        var delta = duration - time_passed;
        var hrs = Math.floor(delta / 3600);
        var mins = Math.floor(delta % 3600 / 60);
        function format_time(xx){
          if(xx < 10) return "0" + xx;
          else return xx;
          }
        return format_time(hrs) + ":" + format_time(mins);
      }

      $scope.setOngoingTimer = function (paper) {
        paper.time_remaining = $scope.getRemainingTime(paper); // Set once
        // Repeat every minute
        paper.timer_handler = $interval(function () {
          paper.time_remaining = $scope.getRemainingTime(paper);
        }, 60000)
      }


      // Open the "Attempt/Resume paper modal"
      $scope.attemptPaper = function(paper){
        if(paper.status != undefined){
          var latestAttempt = paper.allAttempts.slice(-1)[0];
          var latestAttemptDate = new Date(latestAttempt.starttime);
          latestAttempt.date = latestAttemptDate.toLocaleDateString();
        } else {
          var latestAttempt = undefined;
        }
        var paperInstance = $uibModal.open({
          templateUrl:'views/paper-start.html',
          controller:['$uibModalInstance','paper','$scope','$state','attempt','latestAttempt','$interval', function($uibModalInstance,paper,$scope,$state,attempt,latestAttempt,$interval){
            $scope.paper = paper;
            if(paper.status == 'ongoing'){
              $scope.startedOn = (function(){
                var d = new Date(paper.ongoingAttempt.starttime);
                var time = d.toLocaleTimeString().slice(0,5);
                return time
              })();
            }
            $scope.latestAttempt = latestAttempt;  // Undefined if first attempt
            $scope.startPaper = function(){
              $uibModalInstance.close();
              $('#loading_papers').show();
              //create the attempt
              attempt.startOrFetchAttempt(paper, paper.status)
                .then(function(resp){
                  attempt.setAttempt(resp.data);
                  $state.go('home.attempt',{'pid':resp.data.id, 'paper': $scope.paper});
                },function(err){
                  //TODO display proper error message
                  $('#loading_papers').hide();
                  Raven.captureException(err, {
                    level: 'error',
                    logger: 'HomeCtrl',
                    extra:{
                      reason: 'Could not start or fetch attempt'
                    }
                  })
                  if (err.data != undefined && err.data.non_field_errors != undefined){
                    alert(err.data.non_field_errors[0]);  
                  } else {
                    alert("Couldn't start paper");
                  }
                });
            };
            $scope.closeModal = function() {
                $uibModalInstance.close();
            };
          }],
          resolve:{
            paper:paper,
            latestAttempt: latestAttempt
          }
        });
      };

      // Display the results page.
      // Open the result view
      $scope.viewResult = function(paper){
        var latestAttempt = paper.allAttempts.slice(-1)[0]; // Last attempt in the list
        $state.go("home.result", {'aid':latestAttempt.id, 'paper':paper});
      };
      $scope.viewSolution = function(paper){
        //var latestAttempt = paper.allAttempts.slice(-1)[0]; // Last attempt in the list
        $('#loading_papers').show();
        $state.go("home.solutions", {'aid':paper.id, 'attempted':false});
      };
      // View result from the paper-finished modal.
      $scope.$on('viewResult', function (event, payload) {
        var paperId = payload.paper.id;  // payload.paper is outdated by now as new attempt is already created.
        // Because after finishing the paper, view is refreshed, find paper again.
        var paperRefreshed = _.filter($scope.available_papers, function(paper){return paper.id == paperId})[0]
        // Check if the user has ever attempted the paper        
        if(paperRefreshed.allAttempts)
          $scope.viewResult(paperRefreshed);
        else {
          // We open the attempt paper dialog in case the user has never attempted the paper
          console.log('Paper never attempted. Prompt user.');
          var paper = _.find($scope.fresh_papers, function(p){return p.id == paperId}); // Find paper in unattempted papers
          if(paper)
            $scope.attemptPaper(paper);
          else
            console.log('Couldn\'t find paper!');
        }

      });

      $scope.init();

      $('#loading_papers').hide(); // hide the loading animation after initilization

      // Filter papers according to status
      // Note: call only after init()!
      $scope.ongoing_papers = _.filter($scope.available_papers, function(p){
        return p.status == 'ongoing';
      });
      $scope.attempted_papers =_.filter($scope.available_papers, function(p){
        return p.status == 'attempted';
      });
      $scope.fresh_papers =_.filter($scope.available_papers, function(p){
        return p.status == undefined;
      });
      $scope.expired_papers = _.filter($scope.available_papers, function(p){
        return p.isExpired == true;
      });


      // Here we check if vid and vstate vars are populated (user coming from edumate).
      // If so, we redirect him to the results view
      if($stateParams.vid && $stateParams.vstate){
        console.log('Redirecting user to results');
        // Broadcast message with only the essential parameters for state transition
        //$rootScope.$broadcast('viewResult', {paper: {id: $stateParams.vid}});
      }


      // Search
      var list, list2;
      $window.setTimeout(function(){  // Set timeout to avoid clash with angular setup
        list = new List('home_parent_div', {
          listClass:"paper-list",
          valueNames:['paper-name', 'expiry-date']
        });
        list2 = new List('home_parent_div', {
          listClass:"paper-list2",
          valueNames:['paper-title', 'paper-expiry-date']
        });
      });

      $scope.resetSearch = function(){
        $('#search_box .search').val('');
        list.search('');
        list2.search('');
      }

      $scope.goHome = function(){
        $state.go('home');
      }


      // Scrolling
      $('#home_parent_div').scroll(function () {
        var parent_div = $('#home_parent_div');
        var top_bar = $('#home_top_bar');
        var table_head = $('#home_table_head');
        if(parent_div.scrollTop() > 0){
          table_head.addClass('floating');
          top_bar.addClass('floating');
          var offset = parent_div.scrollTop();
          top_bar.css('transform', 'translateY(' + offset + 'px)');
          table_head.css('transform', 'translateY(' + (offset - 10) + 'px)');
        } else {
          top_bar.removeClass('floating');
          table_head.removeClass('floating');
          top_bar.css('transform', 'translateY(0px)');
          table_head.css('transform', 'translateY(0px)');
        }
      })

    }]);
