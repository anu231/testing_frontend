'use strict';

describe('Service: useranswer', function () {

  // load the service's module
  beforeEach(module('testingFrontendApp'));

  // instantiate service
  var useranswer;
  beforeEach(inject(function (_useranswer_) {
    useranswer = _useranswer_;
  }));

  it('should do something', function () {
    expect(!!useranswer).toBe(true);
  });

});
