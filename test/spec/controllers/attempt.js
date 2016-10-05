'use strict';

describe('Controller: AttemptCtrl', function () {

  // load the controller's module
  beforeEach(module('testingFrontendApp'));

  var AttemptCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttemptCtrl = $controller('AttemptCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AttemptCtrl.awesomeThings.length).toBe(3);
  });
});
