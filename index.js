var exec = require('child_process').exec,
    util = require('util'),
    eak_url = "https://github.com/stefanpenner/ember-app-kit.git";

function EmberAppKitNew(appName) {
  this.cloneRepo(appName)
}

EmberAppKitNew.prototype.cloneRepo = function(appName) {
  command = "git clone " + eak_url + " " + appName;
  util.puts("Running: `" + command + "`");

  exec(appName, function(error,stdout,stderr) {

  });
}

module.exports = EmberAppKitNew;
