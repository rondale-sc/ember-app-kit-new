var exec = require('child_process').exec,
    path = require('path'),
    fs   = require('fs-extra'),
    util = require('util'),
    readline = require('readline');

function EmberAppKitNew(appName) {
  this.appName = appName;
}

util.inherits(EmberAppKitNew, (require('events')).EventEmitter);

EmberAppKitNew.prototype.cloneRepo = function() {
  var eak_url = "https://github.com/stefanpenner/ember-app-kit.git",
      command = "git clone " + eak_url + " " + this.appName;

  var child = exec(command);

  child.on('close', function() {
    this.emit('repoCloned');
  }.bind(this));
}

EmberAppKitNew.prototype.cleanRepo = function(){
  fs.remove(path.join(this.appName, '.git'), function(err) {
    if (err) { console.log(err); this.emit('error', err); return; }

    this.emit('repoCleaned');
  }.bind(this));
}

EmberAppKitNew.prototype.installGruntCli = function(){
  process.stdin.once('data', function(answer) {
    if(answer.trim()==="y") {
      var command = 'grunt'
      this.emit(command + " installing");
      this.runNpmCommand();
    }
  }.bind(this));

  process.stdout.write("Do you want to install grunt-cli globally? (y/n)\n");
}

EmberAppKitNew.prototype.runNpmCommand = function(commandString, global){
  var command = "npm install " + (global ? "-g " : "") + commandString
  child = exec(command);

  child.on('close', function(){
    this.emit(commandString + " installed");
  });
};


module.exports = EmberAppKitNew;
