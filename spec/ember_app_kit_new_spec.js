var E = require('../index'),
    helpers = require('./spec_helper'),
    fs = require('fs');

(function(){
  describe("creation", function() {
    var appName = "bad_ass_app";

    it("creates the directory", function(){
      new E(appName);
      expect(helpers.checkPath(appName)).toBeTruthy();
    });

    afterEach(function() {
      fs.rmdir(appName);
    });
  });
}).call(this);
