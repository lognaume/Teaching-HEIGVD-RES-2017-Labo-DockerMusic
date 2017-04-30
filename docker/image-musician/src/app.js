if (process.argv.length < 3) {
    return 1;
}

var instrument = process.argv[2];

const RFC4122 = require('rfc4122');

var rfc4122 = new RFC4122();

var instruments = new Map();
	instruments.set("piano", "ti-ta-ti");
	instruments.set("trumpet", "pouet");
	instruments.set("flute", "trulu");
	instruments.set("violin", "gzi-gzi");
	instruments.set("drum", "boum-boum");

function Musician(sound) {
  this.uuid = rfc4122.v1();
  this.sound = sound;
}

// Sending a message to all nodes on the local network

var dgram = require('dgram');
var broadcastSocket = dgram.createSocket('udp4');

broadcastSocket.bind(0, '', function() {
    broadcastSocket.setBroadcast(true);    
});

var mus = new Musician(instruments.get(instrument));   

var payload = JSON.stringify(mus);
message = new Buffer(payload);


setInterval(function() {
    console.log(payload);

    broadcastSocket.send(message, 0, message.length, 2205, "255.255.255.255", function(err, bytes) {
        console.log("Sending ad: " + payload + " via port " + broadcastSocket.address().port);
    });	
}, 1000);
