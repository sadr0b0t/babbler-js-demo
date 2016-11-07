var BabblerDevice = require('babbler-js');
//var BabblerDevice = require('../../babbler-js/src/babbler');

var babbler = new BabblerDevice();

babbler.on('connected', function() {
    console.log("connected");
    
    console.log("send cmd: ping");
    babbler.sendCmd("ping", [],
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
    babbler.sendCmd("help", ["--list"],
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

babbler.on('disconnected', function(error) {
    console.log("disconnected" + (error != undefined ? ": " + error : ""));
});

babbler.connect("/dev/ttyUSB0");
//babbler.connect("/dev/ttyUSB0", {baudRate: 9600});

