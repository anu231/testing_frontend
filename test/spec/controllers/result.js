'use strict';

describe('Controller: ResultCtrl', function () {

  // load the controller's module
  beforeEach(module('testingFrontendApp'));

  var ResultCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultCtrl = $controller('ResultCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
