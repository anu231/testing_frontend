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
    });
  }));

  it('should not pass', function () {
    $scope.aki = "yolo";
    expect($scope.aki).toBe("yolo");
  });
});
