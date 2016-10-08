//var BabblerDevice = require('babbler-js');
var BabblerDevice = require('../../babbler-js/src/babbler');

var babblerDevice = new BabblerDevice(
    function onStatusChange(status) {
        if(status === BabblerDevice.Status.DISCONNECTED) {
            console.log("disconnected");
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
                function(cmd, msg) {
                    //document.getElementById('serial_read_data').innerHTML += cmd + ": " + msg + "\n";
                    console.log(cmd + ": " + msg);
                }
            );
        }

        if(status === BabblerDevice.Status.DISCONNECTED && babblerDevice.deviceError() != undefined) {
            console.log(" (" + babblerDevice.deviceError() + ")");
        }
    }
);

babblerDevice.addOnDataListener(function onData(data, dir) {
    console.log(dir + ": " + data);
});

babblerDevice.connect("/dev/ttyUSB0", 
    //onData
    function(data) {
        console.log("data: " + data);
    },
    //onDataError
    function(data, error) {
        console.log("error here: " + error);
    }
);


