'use strict';

describe('Service: paper', function () {

  // load the service's module
  beforeEach(module('testingFrontendApp'));

  // instantiate service
  var paper;
  beforeEach(inject(function (_paper_) {
    paper = _paper_;
  }));

  it('should do something', function () {
    expect(!!paper).toBe(true);
  });

});
