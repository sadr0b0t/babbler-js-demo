//var BabblerDevice = require('babbler-js');
var BabblerDevice = require('../../babbler-js/src/babbler');

var babblerDevice = new BabblerDevice();

babblerDevice.on('connected', function() {
    console.log("connected");
    
    babblerDevice.sendCmd("ping", [],
        // onReply
        function(cmd, id, reply) {
        },
        // onError
        function(cmd, err) {
            console.log(cmd + ": " + err);
        }
    );
    
    babblerDevice.sendCmd("help", ["--list"],
        // onReply
        function(cmd, id, reply) {
        },
        // onError
        function(cmd, err) {
            console.log(cmd + ": " + err);
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
babblerDevice.on('data', function(data, dir, err) {
    if(err != undefined) {
        console.log("error: " + err);
    }
    console.log(dir + ": " + data);
});

babblerDevice.connect("/dev/ttyUSB0");
//babblerDevice.connect("/dev/ttyUSB0", {baudRate: 9600});

