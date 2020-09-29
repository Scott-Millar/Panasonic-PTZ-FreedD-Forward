var dgram = require('dgram')
var BROADCAST_ADDR = "10.2.10.255" // Set the broadcast IP address for the output network
// var BROADCAST_ADDR = "127.0.0.255" // Set Local Test IP
var server = []

var PORTIN = [6406,6407,6408] // Set the input ports, the number of values sets the number of relays
var portAdjust = -100 // Set an offset between input port and output port (ie what to put into receiving software)
var PORTOUT = [] 

//Setup Output Ports

PORTIN.forEach(function(item,index){
    PORTOUT.push(PORTIN[index]+portAdjust)
})

//Setup receiving Servers

PORTIN.forEach(element => {
    server.push(dgram.createSocket("udp4"))
})

// Setup Listening on Servers

server.forEach(function(item){item.on('listening', function(){
        var address = item.address()
        console.log('UDP Client listening on :' + address.port)
    })
})

// Setup Message on Servers

server.forEach(function(item, index){item.on('message', function(message,rinfo){
    broadcastData(index, message)
    //    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message)
    })
})

// Broadcast Data

function broadcastData(indexIn, messageIn) {
    var message = Buffer.from(messageIn)
    server[indexIn].send(message, 0, message.length, PORTOUT[indexIn], BROADCAST_ADDR, function() {
    //    console.log("Sent '" + message + "'")
    })
}

server.forEach(function(item, index){item.bind(PORTIN[index],function() {
        item.setBroadcast(true)
    })
})