var exec = require('child_process').exec,
    path = require('path'),
    fs   = require('fs-extra'),
    util = require('util');

function EmberAppKitNew(appName, options) {
  options = options || {};
  this.appName = appName;
  this.stdin = options['stdin'] || process.stdin;
  this.stdout = options['stdout'] || process.stdout;
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
  var input = function(answer) {
    if(answer.trim()==="y") {
      var command = 'grunt'
      this.emit(command + " installing");
      this.runNpmCommand();
      process.stdin.pause();
    }
  }.bind(this)

  this.stdin.once('data', input);
  this.stdout.write("Do you want to install grunt-cli globally? (y/n)\n");
  this.stdin.resume();
}

EmberAppKitNew.prototype.runNpmCommand = function(commandString, global){
  var command = "npm install " + (global ? "-g " : "") + commandString
  child = exec(command);

  child.on('close', function(){
    this.emit(commandString + " installed");
  });
};


module.exports = EmberAppKitNew;
