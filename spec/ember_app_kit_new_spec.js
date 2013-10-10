var EmberAppKitNew = require('../index');
var tape           = require('tape');
var fs             = require('fs-extra');
var path           = require('path');
var exec           = require('child_process').exec;
var readline       = require('readline');

function hook_stdout(callback) {
  var old_write = process.stdout.write

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(process.stdout, arguments)
      callback(string, encoding, fd)
    }
  })(process.stdout.write)

  return function() {
    process.stdout.write = old_write
  }
}

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

    kit.on('repoCloned', function() {
      fs.exists(appName, function(exists) {
        t.ok(exists, "EAKit directory exists");
      })
    });

    t.on('end', cleanup);
  });

  tape('cleanRepo', function(t) {
    t.plan(2);
    var kit = new EmberAppKitNew(appName);

    kit.on('repoCloned', function() {
      fs.exists(path.join(appName, '.git'), function(exists) {
        t.ok(exists, '.git directory exists.');
        kit.cleanRepo();
      });
    });

    kit.on('repoCleaned', function() {
      fs.exists(path.join(appName, '.git'), function(exists) {
        t.notOk(exists, '.git sub-directory was removed!');
      });
    });

    kit.cloneRepo();

    t.on('end', cleanup);
  });

  tape('installGruntCli', function(t){
    t.plan(3);

    var kit = new EmberAppKitNew(appName);
    kit.runNpmCommand = function(){
      t.ok(true, "npm command ran");
    };

    var unhook = hook_stdout(function(data) {
      unhook();
      t.equal(data, "Do you want to install grunt-cli globally? (y/n)\n");
      process.stdin.emit('data', "y\n");
    });

    kit.on('grunt installing', function(){
      t.ok(true);
    });

    kit.installGruntCli();
  });

}).call(this);
