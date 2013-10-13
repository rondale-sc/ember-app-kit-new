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
    console.log('Emitted: repoCloned')
    this.emit('repoCloned');
  }.bind(this));
}

EmberAppKitNew.prototype.cleanRepo = function(){
  fs.remove(path.join(this.appName, '.git'), function(err) {
    if (err) { console.log(err); this.emit('error', err); return; }

    console.log('Emitted: repoCleaned')
    this.emit('repoCleaned');
  }.bind(this));
}

EmberAppKitNew.prototype.installGruntCli = function(){
  var input = function(answer) {
    if(answer.toString().trim()==="y") {
      this.emit("grunt installing");
      this.runNpmCommand("grunt", true);
      process.stdin.pause();
    }
  }.bind(this)

  this.stdin.once('data', input);
  this.stdout.write("Do you want to install grunt-cli globally? (y/n)\n");
  this.stdin.resume();
}

EmberAppKitNew.prototype.installBower = function(){
  var input = function(answer) {
    if(answer.toString().trim()==="y") {
      this.emit("bower installing");
      this.runNpmCommand("bower", true);
      process.stdin.pause();
    }
  }.bind(this)

  this.stdin.once('data', input);
  this.stdout.write("Do you want to install bower globally? (y/n)\n");
  this.stdin.resume();
}

EmberAppKitNew.prototype.npmInstall = function(){
  process.chdir(this.appName);
  this.emit('running npm install');
  this.runNpmCommand("",false,"npm installed");
}

EmberAppKitNew.prototype.runBower = function(){
  this.runBowerCommand("install");
};

EmberAppKitNew.prototype.runNpmCommand = function(commandString, global, eventMsg){
  var commandToBeRun = "npm install " + (global ? "-g " : "") + commandString;
  var eventMsg = eventMsg || commandString + " installed";

  console.log("Running: " + commandToBeRun);
  this.runSysCommand(commandToBeRun,eventMsg);
};

EmberAppKitNew.prototype.runBowerCommand = function(commandString) {
  var commandToBeRun = "bower " + commandString;
  var eventMsg = "ran bower install"

  this.runSysCommand(commandToBeRun, eventMsg);
};

EmberAppKitNew.prototype.runSysCommand = function(commandToBeRun,eventMsg) {
  var child = exec(commandToBeRun);

  child.on('close', function(){
    console.log("Emitted: " + eventMsg);
    this.emit(eventMsg);
  }.bind(this));
};

module.exports = EmberAppKitNew;
