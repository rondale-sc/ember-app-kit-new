var fs = require('fs'),
    path = require('path');

Helpers = {
  checkPath: function(dir) {
    if (path.existsSync(dir)) { return true; }
    return false;
  }
}

module.exports = Helpers;
