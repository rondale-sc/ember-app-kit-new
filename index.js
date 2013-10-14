var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
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
    this.emit('repo-cloned');
  }.bind(this));
}

EmberAppKitNew.prototype.cleanRepo = function(){
  fs.remove(path.join(this.appName, '.git'), function(err) {
    if (err) { console.log(err); this.emit('error', err); return; }

    this.emit('repo-cleaned');
  }.bind(this));
}

EmberAppKitNew.prototype.installGruntCli = function(){
  var input = function(answer) {
    if(answer.toString().trim()==="y") {
      this.emit("grunt installing");
      this.runNpmCommand("grunt-cli", true, "grunt-cli-installed");
    } else {
      this.emit("grunt-cli-skipped");
    };
  }.bind(this)

  process.stdin.pause();

  this.stdin.once('data', input);
  this.stdout.write("Do you want to install grunt-cli globally? (y/n)\n");
  this.stdin.resume();
}

EmberAppKitNew.prototype.npmInstall = function(){
  process.chdir(this.appName);
  this.runNpmCommand("",false,"npm-installed");
}

EmberAppKitNew.prototype.runNpmCommand = function(commandString, global, eventMsg){
  var commandToBeRun = "npm";
  var args = ["install", "--color", "true"];

  if (global) args.push("-g");
  if (commandString.length) args.push(commandString);

  var eventMsg = eventMsg || commandString + "-installed";

  this.runSysCommand(commandToBeRun,args,eventMsg);
};

EmberAppKitNew.prototype.runSysCommand = function(commandToBeRun,args,eventMsg) {
  var child = spawn(commandToBeRun, args,
    {
     cwd: process.cwd(),
     env: process.env,
     stdio: "inherit"
    }
  );

  child.on('error', function(err) {
    console.log(err);
  });

  child.on('close', function(){
    this.emit(eventMsg);
  }.bind(this));
};

module.exports = EmberAppKitNew;
