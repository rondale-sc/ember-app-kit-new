var EmberAppKitNew = require('../index');
var tape           = require('tape');
var fs             = require('fs-extra');
var path           = require('path');
var exec           = require('child_process').exec;
var Readable       = require('stream').Readable;

(function(){
  var appName = "/tmp/test_ember_appkit";
  var cleanup = function() {
    fs.remove(appName, function(err) {
      if (err) { console.log(err); }
    });
  }

  tape('cloneRepo', function(t){
    t.plan(1);

    var kit = new EmberAppKitNew(appName);

    kit.cloneRepo();

    kit.on('repo-cloned', function() {
      fs.exists(appName, function(exists) {
        t.ok(exists, "EAKit directory exists");
      })
    });

    t.on('end', cleanup);
  });

  tape('cleanRepo', function(t) {
    t.plan(2);
    var kit = new EmberAppKitNew(appName);

    kit.on('repo-cloned', function() {
      fs.exists(path.join(appName, '.git'), function(exists) {
        t.ok(exists, '.git directory exists.');
        kit.cleanRepo();
      });
    });

    kit.on('repo-cleaned', function() {
      fs.exists(path.join(appName, '.git'), function(exists) {
        t.notOk(exists, '.git sub-directory was removed!');
      });
    });

    kit.cloneRepo();

    t.on('end', cleanup);
  });

  tape('installGruntCli', function(t){
    t.plan(3);

    var stdin = new Readable();
    stdin._read = function() {};
    var stdout = {
      write: function(data) {
        t.equal(data, "Do you want to install grunt-cli globally? (y/n)\n");
        stdin.emit('data', "y\n");
      }
    };
    var kit = new EmberAppKitNew(appName, { stdin: stdin, stdout: stdout });

    kit.runNpmCommand = function(){
      t.ok(true, "npm command ran");
    };

    kit.once('grunt installing', function(){
      t.ok(true);
    });

    kit.installGruntCli();
  });

  tape('npmInstall', function(t){
    t.plan(2)

    var kit = new EmberAppKitNew(appName),
        oldChdir = process.chdir;

    process.chdir = function(){
      t.ok(true, "current working directory changed");
    };

    kit.runNpmCommand = function(){
      t.ok(true, "npm command ran");
    };

    kit.npmInstall();

    t.on('end', function(){
      process.chdir = oldChdir;
    });
  });
})();
