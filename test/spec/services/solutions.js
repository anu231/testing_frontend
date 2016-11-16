'use strict';

describe('Service: solutions', function () {

  // load the service's module
  beforeEach(module('testingFrontendApp'));

  // instantiate service
  var solutions;
  beforeEach(inject(function (_solutions_) {
    solutions = _solutions_;
  }));

  it('should do something', function () {
    expect(!!solutions).toBe(true);
  });

});
