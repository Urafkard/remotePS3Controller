const SerialPort = require('serialport')

const WebSocket = require('ws');
WebSocketServer = WebSocket.WebSocketServer


const port = new SerialPort('COM5', {
	baudRate: 115200
})

const numArray = [79,80,81,75,76,77,71,72,73]

var buffer = Buffer.alloc(12);
buffer[2] = 0x80;
buffer[3] = 0x80;
buffer[4] = 0x80;
buffer[5] = 0x80;
buffer[6] = 0x80;
buffer[7] = 0x80;
buffer[8] = 0x80;
buffer[9] = 0x80;



const wss = new WebSocketServer({ port: 8080 });

wss.binaryType = "arraybuffer";

let packetCount = 0

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message, isBinary) {
		//console.log(message,isBinary)
		if(isBinary){
			buffer = message;
			packetCount++;
			if(packetCount%10 == 0){
				console.log(buffer)
			}
			port.write(buffer, function(err) {
				if (err) {
					return console.log('Error on write: ', err.message)
				}
			})
		}else{
			result = JSON.parse(message);
			if(result.data == "ping"){
				ws.send(JSON.stringify({"data":"pong","timestamp":result.timestamp}));
			}
		}
	});

	
});


port.on('data', function (data) {
	console.log('Data:', data.toString("utf-8"))
})
