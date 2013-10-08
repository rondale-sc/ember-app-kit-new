var Q = require('q'),
    exec = require('child_process').exec,
    util = require('util'),

function EmberAppKitNew(appName) {
  Q.fcall(this.cloneRepo(appName))
    .then(this.exit)
    .done();
}

EmberAppKitNew.prototype.cloneRepo = function(appName) {
  var eak_url = "https://github.com/stefanpenner/ember-app-kit.git",
      command = "git clone " + eak_url + " " + appName;

  exec(command);
}

EmberAppKitNew.prototype.exit = function(){
  util.puts("Finished!");
}

module.exports = EmberAppKitNew;
