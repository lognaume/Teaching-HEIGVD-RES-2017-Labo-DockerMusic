var dgram = require('dgram');
var moment = require('moment');

// Listening for broadcasted messages on the local network
var broadcastSocket = dgram.createSocket('udp4');

function Musician(uuid, instrument, activeSince) {
	this.uuid = uuid;
	this.instrument = instrument;
	this.activeSince = activeSince;
}

var instruments = new Map();
	instruments.set("ti-ta-ti", "piano");
	instruments.set("pouet", "trumpet");
	instruments.set("trulu", "flute");
	instruments.set("gzi-gzi", "violin");
	instruments.set("boum-boum", "drum");

var musicians = [];

// This call back is invoked when a new datagram has arrived.
broadcastSocket.on('message', function(msg, source) {
    var musician = JSON.parse(msg);
	if (musician["uuid"]) {
		var m = musicians.find(function(element) {
			return element.uuid == musician.uuid;
		});
		if (m) {
			m.activeSince = moment();
		} else {
			var m = new Musician(musician["uuid"], instruments.get(musician["sound"]), moment());
			musicians.push(m);
		}
	}
});

broadcastSocket.bind(2205, function() {});


var net = require('net');

// ---- TCP SERVER ----
// let's create a TCP server
var server = net.createServer();

server.on('connection', clientConnected);

server.listen(2205);

function clientConnected(socket) {
	socket.write(JSON.stringify(musicians.filter(function(element){
		return Math.abs(moment.duration(moment().diff(element.activeSince)).asSeconds()) <= 5;
	})));
	socket.end();
}