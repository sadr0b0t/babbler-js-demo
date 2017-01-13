// Вариант babbler-basic2.js с немного другим синтаксисом
// подписки на события: передавать колбэк onStatusChange
// в конструкторе вместо подписки на события через "babbler.on("event", callback)".
// Подключиться к устройству через последовательный порт, отправить две команды:
// "ping" и "help --list", ожидать отключения устройства. После отключения
// (или если устройство не подключено изначально), пытаться подключиться 
// заново каждые 3 секунды.

var BabblerDevice = require('babbler-js');
//var BabblerDevice = require('../../babbler-js/src/babbler');

var babbler = new BabblerDevice(
    // onStatusChange
    function(status) {
        if(status === BabblerDevice.Status.DISCONNECTED) {
            console.log("disconnected");
            
            if(babbler.deviceError() != undefined) {
                console.log(" (" + babbler.deviceError() + ")");
            }
            
            // повторная попытка подключиться через 3 секунды
            setTimeout(function() {
                babbler.connect("/dev/ttyUSB0");
            }, 3000);
        } else if(status === BabblerDevice.Status.CONNECTING) {
            console.log("connecting...");
        } else if(status === BabblerDevice.Status.CONNECTED) {
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
        }
    }
);

// статус можно слушать так тоже
babbler.on('status', function(status) {
    console.log("status: " + status);
});

// для отладки - следим за потоками данных
babbler.on('data', function(data, dir) {
    console.log(dir + ": " + data);
});

babbler.on('data_error', function(data, dir, err) {
    console.log("error: " + err);
    console.log(data);
});

babbler.connect("/dev/ttyUSB0");
//babbler.connect("/dev/ttyUSB0", {baudRate: 9600});

