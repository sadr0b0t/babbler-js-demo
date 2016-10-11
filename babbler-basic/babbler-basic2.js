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

babblerDevice.on('connecting', function() {
    console.log("connecting...");
});

babblerDevice.on('disconnected', function(error) {
    console.log("disconnected");
    
    if(error != undefined) {
        console.log(" (" + error + ")");
    }
    
    // повторная попытка подключиться через 3 секунды
    setTimeout(function() {
        babblerDevice.connect("/dev/ttyUSB0");
    }, 3000);
});

// статус можно слушать так тоже
babblerDevice.on('status', function(status) {
    console.log("status: " + status);
});

// для отладки - следим за потоками данных
babblerDevice.on('data', function(data, dir) {
    console.log(dir + ": " + data);
});

babblerDevice.on('data_error', function(data, dir, err) {
    console.log("error: " + err);
    console.log(data);
});

babblerDevice.connect("/dev/ttyUSB0");
//babblerDevice.connect("/dev/ttyUSB0", {baudRate: 9600});

