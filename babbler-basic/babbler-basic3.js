//var BabblerDevice = require('babbler-js');
var BabblerDevice = require('../../babbler-js/src/babbler');

var babblerDevice = new BabblerDevice(
    // onStatusChange
    function(status) {
        if(status === BabblerDevice.Status.DISCONNECTED) {
            console.log("disconnected");
            
            if(babblerDevice.deviceError() != undefined) {
                console.log(" (" + babblerDevice.deviceError() + ")");
            }
            
            // повторная попытка подключиться через 3 секунды
            setTimeout(function() {
                babblerDevice.connect("/dev/ttyUSB0");
            }, 3000);
        } else if(status === BabblerDevice.Status.CONNECTING) {
            console.log("connecting...");
        } else if(status === BabblerDevice.Status.CONNECTED) {
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
        }
    }
);

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

