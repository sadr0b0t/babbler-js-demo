// Простой пример
// Подключиться к устройству через последовательный порт, отправить две команды:
// "ping" и "help --list", ожидать отключения устройства

var BabblerDevice = require('babbler-js');
//var BabblerDevice = require('../../babbler-js/src/babbler');

var babbler = new BabblerDevice();

babbler.on('connected', function() {
    console.log("connected");
    
    console.log("send cmd: ping");
    babbler.sendCmd("ping", [],
        // onResult
        function(err, reply, cmd, params) {
            if(err) {
                console.log("fail with '" + cmd + " " + params + "': " + err);
            } else {
                console.log("got reply on '" + cmd + " " + params + "': " + reply);
            }
        }
    );
    
    console.log("send cmd: help --list");
    babbler.sendCmd("help", ["--list"],
        // onResult
        function(err, reply, cmd, params) {
            if(err) {
                console.log("fail with '" + cmd + " " + params + "': " + err);
            } else {
                console.log("got reply on '" + cmd + " " + params + "': " + reply);
            }
        }
    );
});

babbler.on('disconnected', function(err) {
    console.log("disconnected" + (err != undefined ? ": " + err : ""));
});

babbler.connect("/dev/ttyUSB0");
//babbler.connect("/dev/ttyUSB0", {baudRate: 9600});

