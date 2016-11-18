var BabblerDevice = require('babbler-js');
//var BabblerDevice = require('../../babbler-js/src/babbler');

var babbler = new BabblerDevice();
var blinkIntervalId;

babbler.on('connected', function() {
    console.log("connected");
    
    // мигаем лампочкой каждые 2 секунды
    var ledstatus = "off";
    blinkIntervalId = setInterval(function() {
        if(ledstatus === "on") {
            console.log("send cmd: ledoff");
            babbler.sendCmd("ledoff", [],
                // onReply
                function(cmd, params, reply) {
                    console.log("got reply on '" + cmd + " " + params + "': " + reply);
                    ledstatus = "off";
                },
                // onError
                function(cmd, params, err) {
                    console.log("fail with '" + cmd + " " + params + "': " + err);
                }
            );
        } else { // ledstatus === "off"
            console.log("send cmd: ledon");
            babbler.sendCmd("ledon", [],
                // onReply
                function(cmd, params, reply) {
                    console.log("got reply on '" + cmd + " " + params + "': " + reply);
                    ledstatus = "on";
                },
                // onError
                function(cmd, params, err) {
                    console.log("fail with '" + cmd + " " + params + "': " + err);
                }
            );
        }
    }, 3000);
});

babbler.on('disconnected', function(error) {
    console.log("disconnected" + (error != undefined ? ": " + error : ""));
    
    // перестаём мигать, пока не подключены
    clearInterval(blinkIntervalId);
    
    // повторная попытка подключиться через 3 секунды
    setTimeout(function() {
        babbler.connect("/dev/ttyUSB0");
    }, 3000);
});

babbler.connect("/dev/ttyUSB0");
//babbler.connect("/dev/ttyUSB0", {baudRate: 9600});

