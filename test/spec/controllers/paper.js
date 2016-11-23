'use strict';

describe('Controller: PaperCtrl', function () {

  // load the controller's module
  beforeEach(module('testingFrontendApp'));

  var PaperCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaperCtrl = $controller('PaperCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
