'use strict';

/**
 * @ngdoc function
 * @name testingFrontendApp.controller:AttemptCtrl
 * @description
 * # AttemptCtrl
 * Controller of the testingFrontendApp
 */
angular.module('testingFrontendApp')
  .controller('AttemptCtrl', ['$scope','$state','attempt',
  function($scope,$state,attempt) {
    console.log('attempt loaded');
    this.setCurrent = function(e){
      // Unset the previous selected question
      // Set the selected question as current  
      // load the full current question
      console.log(e.target.childNodes);
    }


    
    this.questions = [
      {index:1, subject:'sm', type:'tmc', state:'qua'},
      {index:2, subject:'sp', type:'ts', state:'qa'},
      {index:3, subject:'sc', type:'tn', state:'qua'},
      {index:4, subject:'sm', type:'tmc', state:'qsel'},
      {index:5, subject:'sp', type:'tn', state:'qc'},
      {index:6, subject:'sc', type:'ts', state:'qa'},
      {index:7, subject:'sm', type:'tmc', state:'qm'},
      {index:8, subject:'sp', type:'tmc', state:'qc'},
      {index:9, subject:'sc', type:'tmc', state:'qa'},
      {index:10, subject:'sm', type:'tmc', state:'qm'},
      {index:11, subject:'sp', type:'tmc', state:'qm'},
      {index:12, subject:'sc', type:'ts', state:'qc'},
      {index:13, subject:'sm', type:'tn', state:'qua'},
      {index:14, subject:'sp', type:'tmc', state:'qua'},
      {index:15, subject:'sc', type:'tn', state:'qc'},
      {index:16, subject:'sm', type:'ts', state:'qa'},
      {index:17, subject:'sp', type:'tmc', state:'qm'},
      {index:18, subject:'sc', type:'tmc', state:'qc'},
      {index:19, subject:'sp', type:'tmc', state:'qa'},
      {index:20, subject:'sp', type:'tmc', state:'qua'}
    ];
    
  }]);


/* Notes :
State: The state of the question - (q*)
  qua: UnAttempted
  qsel: Currently Selected
  qa: Attempted                  (is this required?)
  qc: Confirmed
  qm: Marked (for later review)

Type: Type of the question - (t*)
  tmc: Multiple choice questions
  ts: Single choice questions
  tn: numerical questions

Subject: The subject the question belongs to - (s*)
  sm: Math
  sp: Physics
  sc: Chemistry

*/
