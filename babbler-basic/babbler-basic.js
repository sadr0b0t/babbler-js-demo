var BabblerDevice = require('babbler-js');
//var BabblerDevice = require('../../babbler-js/src/babbler');

var babblerDevice = new BabblerDevice();

babblerDevice.on('connected', function() {
    console.log("connected");
    
    console.log("send cmd: ping");
    babblerDevice.sendCmd("ping", [],
        // onReply
        function(cmd, params, reply) {
            console.log("got reply on '" + cmd + " " + params + "': " + reply);
        },
        // onError
        function(cmd, params, err) {
            console.log("fail with '" + cmd + " " + params + "': " + err);
        }
    );
    
    console.log("send cmd: help --list");
    babblerDevice.sendCmd("help", ["--list"],
        // onReply
        function(cmd, params, reply) {
            console.log("got reply on '" + cmd + " " + params + "': " + reply);
        },
        // onError
        function(cmd, params, err) {
            console.log("fail with '" + cmd + " " + params + "': " + err);
        }
    );
});

babblerDevice.on('disconnected', function(error) {
    console.log("disconnected" + (error != undefined ? ": " + error : ""));
});

babblerDevice.connect("/dev/ttyUSB0");
//babblerDevice.connect("/dev/ttyUSB0", {baudRate: 9600});

