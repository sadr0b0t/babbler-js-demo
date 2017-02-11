// Пример посложнее
// Подключиться к устройству через последовательный порт, отправить две команды:
// "ping" и "help --list", ожидать отключения устройства. После отключения
// (или если устройство не подключено изначально), пытаться подключиться 
// заново каждые 3 секунды.


var Babbler = require('babbler-js');
//var Babbler = require('../../babbler-js/src/babbler');

var babbler = new Babbler();

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

babbler.on('connecting', function() {
    console.log("connecting...");
});

babbler.on('disconnected', function(error) {
    console.log("disconnected");
    
    if(error != undefined) {
        console.log(" (" + error + ")");
    }
    
    // повторная попытка подключиться через 3 секунды
    setTimeout(function() {
        babbler.connect("/dev/ttyUSB0");
    }, 3000);
});

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

