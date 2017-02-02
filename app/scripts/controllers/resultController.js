'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
.controller('ResultCtrl',['$scope','$state','attempt','result','paper','p_current_attempt_result','p_user_attempts',
function ($scope,$state,attempt,result,paper,p_current_attempt_result,p_user_attempts) {
  document.title = "Results and Analysis";
  var current_attempt_result = p_current_attempt_result.data;
  var current_attempt = _.find(p_user_attempts.data, function(a){return a.id == current_attempt_result.attempt});
  $scope.current_paper_attempts = _.filter(p_user_attempts.data, function(a){return a.paper_info.id == current_attempt.paper_info.id});
  $scope.processed_current_paper_attempts = [];  // One time processing for "Overtime trend" bar chart
  // $scope.selectedPaper = p_current_paper;
  // Fetch the paper (Review)
  paper.getPaper(current_attempt.paper_info.id).then(function(resp){
    $scope.selectedPaper = resp;
    $scope.initialize();
  }, function(err){
    console.log(err);
    Raven.captureException(err, {
      logger: 'ResultCtrl',
      level: 'error',
      extra: {
        reason: "could not fetch paper"
      }
    })
  });


  $scope.initialize = function () {
    // var lastdate = new Date($scope.selectedPaper.lastdate);
    // var today = new Date();
    // $scope.solutions_visible = (today - lastdate) <= 0 ? false : true;  // Hide solutions
    result.getAllAttemptResults().then(function (resp) {
      $scope.allAttemptResults = _.filter(resp.data, function (r) { return true });
      $scope.current_paper_attempts.forEach(function (attempt) {
        var result = _.find($scope.allAttemptResults, function (result) { return result.attempt == attempt.id });
        if (result) {
          attempt.result = result;
          $scope.processed_current_paper_attempts.push(attempt);
        }
      })
      $scope.selectAttempt(current_attempt.id);
    }, function (err) {
      console.log("Couldnt fetch results...");
      console.log(err);
      Raven.captureException(err, {
        logger: 'ResultCtrl',
        level: 'error',
        extra: {
          reason: "could not fetch results"
        }
      })
    })
  }
  // Data collection and go back
  $scope.goBack = function(){
    $state.go('home');
  };

  // Get to the solutions page.
  $scope.viewSolutions = function(){
    var aid = $scope.selectedAttempt.id;
    $('#loading_papers').show();
    $state.go('home.solutions', {'aid': aid, 'attempt': $scope.selectedAttempt});
  };

  $scope.getFormattedDate = function(date_str){
    var d = new Date(date_str);
    return d.toLocaleDateString() + " : " + d.toLocaleTimeString().slice(0,5);
  }
  // Paper selection pipeline
  // Basically sets the $scope.selectedAttempt variable.
  // $scope.selectedAttempt is used as the model for result area.
  $scope.selectAttempt = function(aid){
    var att = _.find($scope.current_paper_attempts, function(a){return a.id == aid});
    var result = _.find($scope.allAttemptResults, function(r){return att.id == r.attempt})
    if(!result){
      alert("No result found!");
      Raven.captureException(new Error("no result found",{
        logger: "ResultCtrl",
        level: "error",
        extra:{
          reason: 'could not find result for paper in allAttemptResults',
          data: {
            attempt: att,
            results: $scope.allAttemptResults
          }
        }
      }))
    }
    $scope.selectedAttempt = {};
    $scope.selectedAttempt.id = att.id;
    $scope.selectedAttempt.rank = result.mrank;
    $scope.selectedAttempt.marks_obtained = result.marksobt;
    $scope.selectedAttempt.paper_name = att.paper_info.name;
    $scope.selectedAttempt.expiry_date = (function(){
      var ad = new Date($scope.selectedPaper.lastdate);
      return ad.toLocaleDateString();
    })();
    $scope.selectedAttempt.attempt_date = (function(){
      var ad = new Date(att.endtime);
      return ad.toLocaleDateString();
    })();
    $scope.selectedAttempt.duration = (function () {
      var dur = att.paper_info.duration;
      // TODO
      return Math.floor(dur / 60 / 60) + ":" + dur % 60;
    })();
    // TODO check for missing results
    $scope.selectedAttempt.result = (function(){
      return _.find($scope.allAttemptResults, function(r){return r.attempt == att.id})
    })();
    $scope.selectedAttempt.netScore = (function(){
      var r = $scope.selectedAttempt.result;
      var correct = 0, incorrect = 0;
      correct = [r.pcorr,r.ccorr,r.mcorr,r.bcorr,r.zcorr].reduce(function(total, val){
        return total + val;
      });
      incorrect = [r.pwrong,r.cwrong,r.mwrong,r.bwrong,r.zwrong].reduce(function(total, val){
        return total + val;
      });
      return {correct: correct, incorrect: incorrect};

    })();
    $scope.updateCharts();
  }

  //                              >> CHARTS AND ANALYSIS <<                     //
  // Updates charts based on selectedAttempt
  $scope.updateCharts = function () {
    $scope.updateBarChart();
    $scope.updatePieChart();
  }

  $scope.updatePieChart = function(){
    var r = $scope.selectedAttempt.result;
    $scope.pie = {};
    $scope.pie.labels = ["Physics", "Chemistry", "Maths", "Biology", "Zoology"];
    $scope.pie.data = [r.pobt,r.cobt,r.mobt,r.bobt,r.zobt];
    $scope.pie.options = {
      title:{
        display: true,
        text: "Mark Distrubution",
        fontSize: 16,
        padding: 20,
      },
      legend:{
        display: true,
        position: "right"
      }
    };
  }

  $scope.updateBarChart = function(){
    var ptrend = [],
        ctrend = [],
        mtrend = [],
        btrend = [],
        ztrend = []

    // TODO HIDE IF ONLY ONE ATTEMPT
    // Logic
    $scope.bar = {};
    $scope.bar.series = ["Physics", "Chemistry", "Maths", "Biology", "Zoology"];
    $scope.bar.labels = [];
    if($scope.processed_current_paper_attempts.length < 2){ // Hide Bar chart if less than 2 attempts
      $scope.HIDEBARCHART = true; //
      return
    }
    if($scope.processed_current_paper_attempts.length >= 5){
      $scope.processed_current_paper_attempts.splice(-4); // Display trend of last 4 papers only
    }
    $scope.processed_current_paper_attempts.forEach(function(a){
      var date = new Date(a.endtime);
      $scope.bar.labels.push(date.toLocaleDateString());
      ptrend.push(a.result.pobt)
      ctrend.push(a.result.cobt)
      mtrend.push(a.result.mobt)
      btrend.push(a.result.bobt)
      ztrend.push(a.result.zobt)
    });

    // Graphics

    $scope.bar.data = [ptrend, ctrend, mtrend, btrend, ztrend];
    // $("#leg").html =
    $scope.bar.options = {
      title: {
        display: true,
        text: "Trend Over Time",
        fontSize: 16,
        padding: 20,
      },
      legend: {
        display: true,
      },
      labels: {
        fontSize: 6
      }
    }
  }


  ////          ANIMATIONS AND EFFECTS          ////
  var lastScrollTop = 0;
  $('#results_and_analysis_parent').scroll(function(event){
     var st = $(this).scrollTop();
     if (st > lastScrollTop){
       $('#result_area_controls').addClass('hide-controls');
     } else {
       $('#result_area_controls').removeClass('hide-controls');
     }
     lastScrollTop = st;
  });

  $scope.analysis = JSON.parse('{"Physics": {"score": 0, "child": {"Work ,Energy and power": {"score": 0, "child": {"Power": {"score": 0, "child": {}}}}, "Fluids": {"score": -2, "child": {"Bernoulli\'s theorem and it\'s applications": {"score": -1, "child": {}}, "Surface tension": {"score": -1, "child": {}}}}, "Electromagnetic Induction( EMI )": {"score": -1, "child": {}}, "Ray Optics": {"score": -1, "child": {"Thin lenses": {"score": -1, "child": {}}}}, "Kinematics": {"score": 0, "child": {}}, "Heat and thermodynamics": {"score": 6, "child": {"Caloriemetry": {"score": 0, "child": {}}, "Expansion of solid": {"score": 3, "child": {}}, "Black body radiation": {"score": 3, "child": {}}}}, "Wave optics": {"score": 0, "child": {"Interference of light": {"score": 0, "child": {}}}}, "Modern Physics": {"score": 0, "child": {"Photons": {"score": 0, "child": {}}}}, "Units,Dimensions & Error analysis": {"score": 0, "child": {"Experiments based on using verniercalipers and screw gauge ( micrometer )": {"score": 0, "child": {}}}}, "Circular motion": {"score": 0, "child": {}}, "Wave Motion": {"score": -1, "child": {"Transverse waves on a string": {"score": 0, "child": {}}, "Doppler effect in sound": {"score": -1, "child": {}}}}, "Simple harmonic motion": {"score": -1, "child": {}}}}, "Chemistry": {"score": 7, "child": {"Physical": {"score": 5, "child": {"Chemical equilibrium": {"score": 0, "child": {}}, "Gaseous State": {"score": 4, "child": {}}, "Thermodynamics": {"score": -1, "child": {}}, "Volumetric analysis": {"score": 3, "child": {}}}}, "Organic": {"score": -1, "child": {"CARBONYLS": {"score": 0, "child": {}}, "Nomecalture": {"score": 0, "child": {"Aliphatic": {"score": 0, "child": {"Alkenes": {"score": 0, "child": {}}}}}}, "Phenols": {"score": -1, "child": {}}, "CARBOXYLIC ACIDS AND ITS DERIVATIVES": {"score": -1, "child": {}}, "Alcohols": {"score": 0, "child": {}}, "GOC": {"score": 0, "child": {}}}}, "Inorganic": {"score": -1, "child": {"Coordination Compounds": {"score": 0, "child": {}}, "P-block": {"score": 0, "child": {}}, "Qualitative": {"score": -1, "child": {}}}}}}, "Math": {"score": 7, "child": {"Solutions of Triangle": {"score": 3, "child": {}}, "Three Dimensional Geometry": {"score": 0, "child": {}}, "Differential Equations": {"score": 0, "child": {}}, "Sequence & Series": {"score": 3, "child": {}}, "Straight Lines & Pair of Straight Lines": {"score": 0, "child": {"Different forms of the straight lines": {"score": 0, "child": {"Locus and its Equation": {"score": 0, "child": {}}}}, "Straight lines": {"score": 0, "child": {}}}}, "Quadratic Equations": {"score": 3, "child": {}}, "Determinants & Matrices": {"score": 0, "child": {"Matrices Multiplications": {"score": 0, "child": {}}}}, "Definite integrals": {"score": 0, "child": {}}, "Inverse Trigonometric Functions": {"score": 0, "child": {}}, "Limits": {"score": 0, "child": {}}, "Circles": {"score": 0, "child": {}}, "Probability": {"score": -1, "child": {}}, "Trigonometric Ratios & Identities": {"score": 0, "child": {}}, "Continuity.Differentiability & Derivatives": {"score": 0, "child": {}}, "Permutations & Combinations": {"score": -1, "child": {}}}}}');

  console.log($scope.analysis);
  $scope.toggle_subtopics = function(subject){

    function set_state(subject, items, action, state){
      // Iterate over each item in items and set its state
      if(action == 'add'){
        items.forEach(function(row) {
          row.classList.add(state);
        }, this);
        document.querySelector('#analysis-'+ subject +' #chevron-up').classList.add('hidden');
        document.querySelector('#analysis-'+ subject +' #chevron-down').classList.remove('hidden');
        if(subject == 'chemistry'){
          var subtopics = document.querySelectorAll('.subtopic');
          subtopics.forEach(function(subtopic) {
            subtopic.classList.add(state);
          }, this);
        }
      } else if (action == 'remove'){
        items.forEach(function(row) {
          row.classList.remove(state);
        }, this);
        document.querySelector('#analysis-'+ subject +' #chevron-up').classList.remove('hidden');
        document.querySelector('#analysis-'+ subject +' #chevron-down').classList.add('hidden');
        if(subject == 'chemistry'){
          var subtopics = document.querySelectorAll('.subtopic');
          subtopics.forEach(function(subtopic) {
            subtopic.classList.remove(state);
          }, this);
        }
      }
    }


    var subjectdiv = document.getElementById('analysis-' + subject.toLowerCase());
    var topics = document.querySelectorAll('[data-subject="'+ subject +'"]');
    var collapsed = subjectdiv.getAttribute('data-collapsed'); // Boolean
    if( collapsed == 'false' || collapsed == null ){
      // Collapse all topics
      set_state(subject.toLowerCase(), topics, 'add', 'collapsed');
      subjectdiv.setAttribute('data-collapsed', 'true');
    } else if ( collapsed == 'true' ){
      // Un-Collapse all topics
      set_state(subject.toLowerCase(), topics, 'remove', 'collapsed');
      subjectdiv.setAttribute('data-collapsed', 'false');
    }
  }

}]);
