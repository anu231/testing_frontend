'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AnalysisCtrl
 * @description
 * # AnalysisCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('AnalysisCtrl', 
  	['$scope','$http', 'server',
  	function ($scope, $http, server) {
	    $scope.analysis = null;
	    $scope.chart_analysis = null;
	    $scope.subject_map = {
	    	'Total':'marks',
	    	'Physics':'p',
	    	'Chemistry':'c',
	    	'Maths':'m',
	    	'Biology':'b'
	    };
	    $scope.subject_colors = {
	    	'Total':'rgb(63,81,181)',
	    	'Physics':'rgb(0,105,92)',
	    	'Chemistry':'rgb(198,40,40)',
	    	'Maths':'rgb(255,214,0)',
	    	'Biology':'rgb(38,50,56)'
	    };
	    $scope.chart_options = {
		    scales: {
		      xAxes: [
		        {
		          display: false,
		        }
		      ]
		    }
	    };
	    $scope.fetch_analysis = function () {
	    	$http.get(server+'attempts/get_overall_analysis/')
	    	.then(function(resp){
	    		$scope.analysis = resp.data;
	    		$scope.update_analysis_charts();
	    	}, function(err){
	    		alert('Error getting overall analysis. Please contact support.');
	    	})
	    }

	    $scope.update_analysis_charts = function(){
	    	$scope.x_labels = _.map($scope.analysis,function(val){
	    		var lab = val.paper;
	    		return val.paper.split(" -- ")[0].replace('Rao Major Test','RMT').replace('All India','');
	    	});
	    	$scope.chart_analysis = {};
	    	var subjects = Object.keys($scope.subject_map);
	    	for (var i=0; i<subjects.length; i++){
	    		var check_all_zero = true;
	    		var subj = {};
	    		subj['name'] = subjects[i];
	    		subj['data'] = [_.map($scope.analysis, function(val){
	    			var marks = parseInt(val[$scope.subject_map[subjects[i]]+'obt']);
	    			if (marks!=0){
	    				check_all_zero = false;
	    			}
	    			return marks;
	    		})];
	    		//subj['color_chart'] = [{'backgroundColor':$scope.subject_colors[subjects[i]], 'borderColor':'red'}];	    		 
	    		subj['color_chart'] = [$scope.subject_colors[subjects[i]]];
	    		if (check_all_zero){
	    			continue;
	    		}else{
	    			$scope.chart_analysis[subjects[i]] = subj;
	    		}
	    	}
    	}
    	$scope.fetch_analysis();
  }]);
