//var BabblerDevice = require('babbler-js');
var BabblerDevice = require('../../babbler-js/src/babbler');

var babblerDevice = new BabblerDevice(
    // onStatusChange
    function(status) {
        if(status === BabblerDevice.Status.DISCONNECTED) {
            console.log("disconnected");
            
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
                    //document.getElementById('serial_read_data').innerHTML += cmd + ", id=" + id + ': ' + reply + "\n";
                },
                // onError
                function(cmd, msg) {
                    //document.getElementById('serial_read_data').innerHTML += cmd + ": " + msg + "\n";
                    console.log(cmd + ": " + msg);
                }
            );
            
            babblerDevice.sendCmd("help", ["--list"],
                // onReply
                function(cmd, id, data) {
                    //document.getElementById('serial_read_data').innerHTML += cmd + ", id=" + id + ': ' + data + "\n";
                },
                // onError
                function(cmd, err) {
                    //document.getElementById('serial_read_data').innerHTML += cmd + ": " + err + "\n";
                    console.log(cmd + ": " + err);
                }
            );
        }

        if(status === BabblerDevice.Status.DISCONNECTED && babblerDevice.deviceError() != undefined) {
            console.log(" (" + babblerDevice.deviceError() + ")");
        }
    }
);

babblerDevice.on('status', function(status) {
    console.log("status: " + status);
});

babblerDevice.on('data', function(data, dir, err) {
    if(err != undefined) {
        console.log("error: " + err);
    }
    console.log(dir + ": " + data);
});

babblerDevice.connect("/dev/ttyUSB0");

