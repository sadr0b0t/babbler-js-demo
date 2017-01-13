// Мигать лампочкой: посылать устройств команды ledon/ledoff через
// каждые 3 секунды.
// Подключиться к устройству через последовательный порт, начать мигать лампочкой. 
// После отключения (или если устройство не подключено изначально), пытаться 
// подключиться заново каждые 3 секунды.

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
                // onResult
                function(err, reply, cmd, params) {
                    if(err) {
                        console.log("fail with '" + cmd + " " + params + "': " + err);
                    } else {
                        console.log("got reply on '" + cmd + " " + params + "': " + reply);
                        ledstatus = "off";
                    }
                }
            );
        } else { // ledstatus === "off"
            console.log("send cmd: ledon");
            babbler.sendCmd("ledon", [],
                // onResult
                function(err, reply, cmd, params) {
                    if(err) {
                        console.log("fail with '" + cmd + " " + params + "': " + err);
                    } else {
                        console.log("got reply on '" + cmd + " " + params + "': " + reply);
                        ledstatus = "on";
                    }
                }
            );
        }
    }, 3000);
});

babbler.on('connecting', function() {
    console.log("connecting...");
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

