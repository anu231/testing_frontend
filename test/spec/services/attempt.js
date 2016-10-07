'use strict';

describe('Service: attempt', function () {

  // load the service's module
  beforeEach(module('testingFrontendApp'));

  // instantiate service
  var attempt;
  beforeEach(inject(function (_attempt_) {
    attempt = _attempt_;
  }));

  it('should do something', function () {
    expect(!!attempt).toBe(true);
  });

});
