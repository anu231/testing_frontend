'use strict';

describe('Controller: SolutionsCtrl', function () {

  // load the controller's module
  beforeEach(module('testingFrontendApp'));

  var SolutionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolutionsCtrl = $controller('SolutionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SolutionsCtrl.awesomeThings.length).toBe(3);
  });
});
