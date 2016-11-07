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

