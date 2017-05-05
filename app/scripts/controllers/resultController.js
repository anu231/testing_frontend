'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * @param {service} attempt
 * @param {service} result
 * @param {service} paper
 * @param {} p_current_attempt_result
 * @param {} p_user_attempts
 */
angular.module('testingFrontendApp')
    // .config(['ChartJsProvider', function(ChartJsProvider){
    //     // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    //     ChartJsProvider.setOptions({ colors : [ '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#00ADF9', '#803690'] });
    // }])
    .config(['ChartJsProvider', function(ChartJsProvider){
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: [ '#3F51B5', '#f44336', '#78909C', '#FFEE58', '#AB47BC', '#7E57C2', '#26C6DA', '#26A69A', '#ffb3ba', '#ffdfba', '#ffffba', ],
    });
  }])
    .controller('ResultCtrl', ['$scope', '$state', 'attempt', 'result', 'paper', 'p_current_attempt_result', 'p_user_attempts',
        function ($scope, $state, attempt, result, paper, p_current_attempt_result, p_user_attempts) {
            document.title = "Results and Analysis";
            var current_attempt_result = p_current_attempt_result.data; // Latest attempt result
            var current_attempt = _.find(p_user_attempts.data, function (a) { // Latest attempt
                return a.id == current_attempt_result.attempt
            });
            $scope.current_paper_attempts = _.filter(p_user_attempts.data, function (a) {
                return a.paper_info.id == current_attempt.paper_info.id
            });
            $scope.processed_current_paper_attempts = []; // One time processing for "Overtime trend" bar chart

            // Fetch the paper (Review)
            paper.getPaper(current_attempt.paper_info.id)
            .then(function (resp) {
                $scope.selectedPaper = resp;
                $scope.initialize();
            }, function (err) {
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
                result.getAllAttemptResults()
                .then(function (resp) {
                    $scope.allAttemptResults = _.filter(resp.data, function (r) { // TODO Why?
                        return true
                    });
                    $scope.current_paper_attempts.forEach(function (attempt) {
                        var result = _.find($scope.allAttemptResults, function (result) {
                            return result.attempt == attempt.id
                        });
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
            $scope.goBack = function () {
                $state.go('home');
            };

            // Get to the solutions page.
            $scope.viewSolutions = function () {
                var aid = $scope.selectedAttempt.id;
                $('#loading_papers').show();
                $state.go('home.solutions', {
                    'aid': aid,
                    'attemptInstance': $scope.selectedAttempt
                });
            };

            $scope.getFormattedDate = function (date_str) {
                var d = new Date(date_str);
                return d.toLocaleDateString() + " : " + d.toLocaleTimeString().slice(0, 5);
            }
            // Paper selection pipeline
            // Basically sets the $scope.selectedAttempt variable.
            // $scope.selectedAttempt is used as the model for result area.
            $scope.selectAttempt = function (aid) {
                var att = _.find($scope.current_paper_attempts, function (a) {
                    return a.id == aid
                });
                var result = _.find($scope.allAttemptResults, function (r) {
                    return att.id == r.attempt
                })
                if (!result) {
                    console.log("No result found!");
                    Raven.captureException(new Error("no result found", {
                        logger: "ResultCtrl",
                        level: "error",
                        extra: {
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
                $scope.selectedAttempt.expiry_date = (function () {
                    var ad = new Date($scope.selectedPaper.lastdate);
                    return ad.toLocaleDateString();
                })();
                $scope.selectedAttempt.attempt_date = (function () {
                    var ad = new Date(att.endtime);
                    return ad.toLocaleDateString();
                })();
                $scope.selectedAttempt.duration = (function () {
                    var dur = att.paper_info.duration;
                    // TODO
                    return Math.floor(dur / 60 / 60) + ":" + dur % 60;
                })();
                // TODO check for missing results
                $scope.selectedAttempt.result = (function () {
                    return _.find($scope.allAttemptResults, function (r) {
                        return r.attempt == att.id
                    })
                })();
                $scope.selectedAttempt.netScore = (function () {
                    var r = $scope.selectedAttempt.result;
                    var correct = 0,
                        incorrect = 0;
                    correct = [r.pcorr, r.ccorr, r.mcorr, r.bcorr, r.zcorr].reduce(function (total, val) {
                        return total + val;
                    });
                    incorrect = [r.pwrong, r.cwrong, r.mwrong, r.bwrong, r.zwrong].reduce(function (total, val) {
                        return total + val;
                    });
                    return {
                        correct: correct,
                        incorrect: incorrect
                    };

                })();
                $scope.updateCharts();
            }

//                              >> CHARTS AND ANALYSIS <<                     //
            // Updates charts based on selectedAttempt

            $scope.charts = {
                totalMarks: {
                    info: {
                        labels: ["Physics", "Chemistry", "Maths", "Biology", "Zoology"],
                        options: {
                            title: {
                                display: true,
                                text: "Mark Distrubution",
                                fontSize: 16,
                                padding: 20,
                            },
                            legend: {
                                display: true,
                                position: "right"
                            }
                        },
                    },
                    data: [], // Update these values
                    update: function(){
                        var r = $scope.selectedAttempt.result;
                        // this.data = [r.pobt, r.cobt, r.mobt, r.bobt, r.zobt];
                        this.data = [1,1,1,1,1]
                    }
                },
                trendOverTime: {
                    updated: false,
                    info: {
                        options: {
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
                        },
                        series: ["Physics", "Chemistry", "Maths", "Biology", "Zoology"],
                        labels: [], // Update these values
                    },
                    data: [[], [], [], [], []], // p, c, m, b, z
                    updateOnce: function(){
                        if(this.updated) return;
                        else this.updated = true;
                        if ($scope.processed_current_paper_attempts.length < 2) {
                            $scope.HIDEBARCHART = false; //
                            // return
                        }
                        var ptrend = [],
                            ctrend = [],
                            mtrend = [],
                            btrend = [],
                            ztrend = [];
                        $scope.processed_current_paper_attempts.forEach(function (a) {
                            var date = new Date(a.endtime);
                            this.info.labels.push(date.toLocaleDateString());
                            ptrend.push(a.result.pobt)
                            ctrend.push(a.result.cobt)
                            mtrend.push(a.result.mobt)
                            btrend.push(a.result.bobt)
                            ztrend.push(a.result.zobt)
                        }.bind(this));
                        // this.data = [ptrend, ctrend, mtrend, btrend, ztrend];
                        this.data = [Array(5).fill(Math.random()*5), Array(5).fill(Math.random()*5), Array(5).fill(Math.random()*5), Array(5).fill(Math.random()*5), Array(5).fill(Math.random()*5)];
                    }

                },
                subTopicDistribution: { // For each subject
                    subjects: {},
                    info: {
                        options: {
                            title: {
                                display: true,
                                text: "Sub Topic Distribution",
                                fontSize: 16,
                                padding: 20,
                            },
                        },
                    },
                    update: function(){
                        var availableSubjects = Object.keys($scope.analysis);
                        // Populate each subject with its topics[], marks[], and percentile[].
                        availableSubjects.forEach(function(subject){
                            var topics = _.sortBy($scope.analysis[subject].topics, function(topic){
                                return topic.percentile;
                            }).reverse();
                            // Set up fields
                            this.subjects[subject] = {topics:[],data:{marks:[],percentile:[]}};
                            // Populate topics
                            this.subjects[subject].topics = topics.map(function(topic){return topic.name});
                            // Populate marks
                            this.subjects[subject].data.marks = topics.map(function(topic){
                                return topic.marks;
                            }.bind(this));
                            // Populate percentile
                            this.subjects[subject].data.percentile = topics.map(function(topic){
                                return topic.percentile;
                            }.bind(this));
                        }.bind(this));
                        console.log(this);
                    }
                },
                questionDistribution: {
                    subjects: {},
                    info: {
                        options: {
                            title: {
                                display: true,
                                text: "Question Type Distribution",
                                fontSize: 16,
                                padding: 20,
                            },
                            legend:{
                                display: true,
                                position: 'bottom',
                                 labels: {
                                    fontSize: 12,
                                    boxWidth: 20,
                                    fontFamily: 'Roboto'
                                },
                            },

                        },
                    },
                }
            }

            $scope.$on('chart-update', function (evt, chart) {
                console.log(chart);
            });

            $scope.updateCharts = function () {
                $scope.charts.totalMarks.update()
                $scope.charts.trendOverTime.updateOnce()
                $scope.charts.subTopicDistribution.update();
            }

            $scope.analysis = {"physics":{"topics":[{"id":0,"name":"Topic-0","marks":9,"percentile":85.445},{"id":1,"name":"Topic-1","marks":7,"percentile":10.239},{"id":2,"name":"Topic-2","marks":1,"percentile":1.3800000000000001},{"id":3,"name":"Topic-3","marks":5,"percentile":61.141},{"id":4,"name":"Topic-4","marks":4,"percentile":23.154}]},"chemistry":{"topics":[{"id":0,"name":"Topic-0","marks":4,"percentile":82.552},{"id":1,"name":"Topic-1","marks":0,"percentile":25.901999999999997},{"id":2,"name":"Topic-2","marks":1,"percentile":80.04599999999999},{"id":3,"name":"Topic-3","marks":9,"percentile":98.156},{"id":4,"name":"Topic-4","marks":4,"percentile":22.554},{"id":5,"name":"Topic-5","marks":6,"percentile":49.047}]},"maths":{"topics":[{"id":0,"name":"Topic-0","marks":10,"percentile":59.400000000000006},{"id":1,"name":"Topic-1","marks":7,"percentile":17.355},{"id":2,"name":"Topic-2","marks":4,"percentile":69.94200000000001},{"id":3,"name":"Topic-3","marks":10,"percentile":95.482},{"id":4,"name":"Topic-4","marks":2,"percentile":11.632},{"id":5,"name":"Topic-5","marks":5,"percentile":70.378},{"id":6,"name":"Topic-6","marks":7,"percentile":0.782},{"id":7,"name":"Topic-7","marks":2,"percentile":46.864999999999995},{"id":8,"name":"Topic-8","marks":0,"percentile":78.662},{"id":9,"name":"Topic-9","marks":9,"percentile":64.797},{"id":10,"name":"Topic-10","marks":6,"percentile":78.513}]}}



            $scope.toggle_card = function (subject) {

                var card = document.querySelector('[data-subject="' + subject + '"]');
                console.log(subject);
                var collapsed = card.getAttribute('data-collapsed'); // Boolean
                var cardBody = card.querySelector('.subject-body');
                if (collapsed == 'false' || collapsed == null) {
                    cardBody.classList.add('collapsed');
                    card.setAttribute('data-collapsed', 'true');
                } else if (collapsed == 'true') {
                    cardBody.classList.remove('collapsed');
                    card.setAttribute('data-collapsed', 'false');
                }

        }
    }
    ]);
