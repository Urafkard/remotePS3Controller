let strutControllers = {
	"PS4":{
		imgSrcController:"icons/PS4/controller.png",
		imgController:null,
		itemsToLoad:29,
		itemsLoaded:0,
		numButtons:18,
		x:0,
		y:64,
		buttons:[
			{"name":"X Button","type":"push","off":"icons/PS4/XButtonPS4_1.png","on":"icons/PS4/XButtonPS4_2.png","offImg":null,"onImg":null,"x":474,"y":155,"bufferPos":0,"relPos":1},
			{"name":"O Button","type":"push","off":"icons/PS4/CButtonPS4_1.png","on":"icons/PS4/CButtonPS4_2.png","offImg":null,"onImg":null,"x":519,"y":111,"bufferPos":0,"relPos":2},
			{"name":"Square Button","type":"push","off":"icons/PS4/SButtonPS4_1.png","on":"icons/PS4/SButtonPS4_2.png","offImg":null,"onImg":null,"x":432,"y":111,"bufferPos":0,"relPos":0},
			{"name":"Triangle Button","type":"push","off":"icons/PS4/TButtonPS4_1.png","on":"icons/PS4/TButtonPS4_2.png","offImg":null,"onImg":null,"x":475,"y":67,"bufferPos":0,"relPos":3},
			{"name":"L1","type":"push","off":"icons/PS4/L1PS4_1.png","on":"icons/PS4/L1PS4_2.png","offImg":null,"onImg":null,"x":120,"y":15,"bufferPos":0,"relPos":4},
			{"name":"R1","type":"push","off":"icons/PS4/R1PS4_1.png","on":"icons/PS4/R1PS4_2.png","offImg":null,"onImg":null,"x":475,"y":15,"bufferPos":0,"relPos":5},
			{"name":"L2","type":"trigger","off":"icons/PS4/L2PS4_1.png","on":"icons/PS4/L2PS4_2.png","offImg":null,"onImg":null,"x":120,"y":-16,"bufferPos":0,"relPos":6,"bufferTriggerPos":5},
			{"name":"R2","type":"trigger","off":"icons/PS4/R2PS4_1.png","on":"icons/PS4/R2PS4_2.png","offImg":null,"onImg":null,"x":475,"y":-16,"bufferPos":0,"relPos":7,"bufferTriggerPos":6},
			{"name":"Share","type":"push","off":"icons/PS4/SharePS4_1.png","on":"icons/PS4/SharePS4_2.png","offImg":null,"onImg":null,"x":173,"y":55,"bufferPos":1,"relPos":0},
			{"name":"Options","type":"push","off":"icons/PS4/OptionsPS4_1.png","on":"icons/PS4/OptionsPS4_2.png","offImg":null,"onImg":null,"x":413,"y":55,"bufferPos":1,"relPos":1},
			{"name":"L3","type":"joystick","off":"icons/PS4/L3PS4_1.png","on":"icons/PS4/L3PS4_2.png","offImg":null,"onImg":null,"x":200,"y":190,"bufferPos":1,"relPos":2},
			{"name":"R3","type":"joystick","off":"icons/PS4/R3PS4_1.png","on":"icons/PS4/R3PS4_2.png","offImg":null,"onImg":null,"x":388,"y":190,"bufferPos":1,"relPos":3},
			{"name":"DPadUp","type":"DPad","off":"icons/PS4/UpDirectionalButtonPS4_1.png","on":"icons/PS4/UpDirectionalButtonPS4_1_on.png","offImg":null,"onImg":null,"x":112,"y":86,"hatN":0},
			{"name":"DPadDown","type":"DPad","off":"icons/PS4/DownDirectionalButtonPS4_1.png","on":"icons/PS4/DownDirectionalButtonPS4_1_on.png","offImg":null,"onImg":null,"x":112,"y":137,"hatN":2},
			{"name":"DPadLeft","type":"DPad","off":"icons/PS4/LeftDirectionalButtonPS4_1.png","on":"icons/PS4/LeftDirectionalButtonPS4_1_on.png","offImg":null,"onImg":null,"x":87,"y":112,"hatN":3},
			{"name":"DPadRight","type":"DPad","off":"icons/PS4/RightDirectionalButtonPS4_1.png","on":"icons/PS4/RightDirectionalButtonPS4_1_on.png","offImg":null,"onImg":null,"x":138,"y":112,"hatN":1},
			
		]
	}

}

//Hat Switch Magic
const hatSwitchObj = {0b0001:0,0b0011:1,0b0010:2,0b0110:3,0b0100:4,0b1100:5,0b1000:6,0b1001:7,0b0000:8}


var buffer = new Uint8Array(12);

function loadController(name){
	function loaded(){
		strutControllers[name].itemsLoaded++;
		
		if(strutControllers[name].itemsToLoad == strutControllers[name].itemsLoaded) {
			console.log("loaded images");
			for(let i = 0; i < buffer.length;i++) {
				document.getElementsByClassName("rightcolumn")[0].innerHTML += "<br><input type=\"checkbox\" id=\"z"+i+"c\" name=\"bufferD\"><input type=\"number\" id=\"z"+i+"\" name=\"buffer\" min=\"0\" max=\"255\">"
			}
			start();
			
		};
	}
	strutControllers[name].imgController = new Image();
	strutControllers[name].imgController.onload = loaded;

	strutControllers[name].imgController.src = strutControllers[name].imgSrcController;

	for(let i = 0; i < strutControllers[name].buttons.length;i++){
		if(strutControllers[name].buttons[i].type == "push" || strutControllers[name].buttons[i].type == "trigger" || strutControllers[name].buttons[i].type == "joystick" || strutControllers[name].buttons[i].type == "DPad"){
			strutControllers[name].buttons[i].offImg = new Image();
			strutControllers[name].buttons[i].offImg.onload = loaded;

			strutControllers[name].buttons[i].onImg = new Image();
			strutControllers[name].buttons[i].onImg.onload = loaded;

			strutControllers[name].buttons[i].offImg.src = strutControllers[name].buttons[i].off;
			strutControllers[name].buttons[i].onImg.src = strutControllers[name].buttons[i].on;
		}
	}
	
}



var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.cancelRequestAnimationFrame;

var loop;

var controllerType = "PS4"
loadController(controllerType);
var curGamepad = 0;
var gp;
var ctx;
var c;
function start(){

	c = document.getElementById("controller");
	c.width = document.getElementsByClassName("leftcolumn")[0].offsetWidth
	c.height = document.getElementsByClassName("leftcolumn")[0].offsetHeight
	ctx = c.getContext("2d");
	window.addEventListener("gamepadconnected", function(e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",e.gamepad.index,e.gamepad.id,e.gamepad.buttons.length,e.gamepad.axes.length);
		gameLoop()
		

	})
	
	window.addEventListener("gamepaddisconnected", function(e) {
		rAFStop(loop)
		console.log("Gamepad disconnected from index %d: %s",
			e.gamepad.index, e.gamepad.id);
	});
}



let axesBuffer = [2,3,4,5]




buffer[2] = 0x80;
buffer[3] = 0x80;
buffer[4] = 0x80;
buffer[5] = 0x80;
buffer[6] = 0x80;



function pollGamepads() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	gp = gamepads[curGamepad];

}


let socket;
function connect(){
	socket = new WebSocket(document.getElementById("host").value);
	socket.binaryType = "arraybuffer";


	
	socket.addEventListener('open', function (event) {
	    setInterval(ping,1000);
	});

	// Listen for messages
	socket.addEventListener('message', function (event) {
		if(event.data == "pong"){
			document.getElementById("ping").innerHTML = "ping: "+ (Date.now() - event.timestamp)+ " ms.";
 		}
	});

	function ping(){
		if(socket.readyState == 1){	
			socket.send(JSON.stringify({"data":"ping","timestamp":Date.now()}));
		}
	}
	connected = true;
}

let connected = false;


let deltaTime = 0;

let prevTime = Date.now();

const minTime = 15;

function gameLoop(){

	pollGamepads();
	ctx.clearRect(0, 0, c.width, c.height);

	c.width = document.getElementsByClassName("leftcolumn")[0].offsetWidth
	c.height = document.getElementsByClassName("leftcolumn")[0].offsetHeight
	ctx.scale(c.width/strutControllers[controllerType].imgController.width*0.85, c.height/strutControllers[controllerType].imgController.height*0.85);
	

	hatSwitchMagicNumber = 0;

	ctx.drawImage(strutControllers[controllerType].imgController,strutControllers[controllerType].x,strutControllers[controllerType].y);
	let axesCount = 0;
	for(var i = 0; i < gp.buttons.length && i < strutControllers[controllerType].buttons.length; i++){
		if(strutControllers[controllerType].buttons[i].type == "push"){
			if(gp.buttons[i].pressed){
				ctx.drawImage(strutControllers[controllerType].buttons[i].onImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}else{
				ctx.drawImage(strutControllers[controllerType].buttons[i].offImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}
			buffer[strutControllers[controllerType].buttons[i].bufferPos] ^= (-gp.buttons[i].pressed ^ buffer[strutControllers[controllerType].buttons[i].bufferPos]) & (1 << strutControllers[controllerType].buttons[i].relPos);
		}else if(strutControllers[controllerType].buttons[i].type == "trigger"){
			if(gp.buttons[i].pressed){
				ctx.fillStyle = "green";
				ctx.fillRect(strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x-2, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y, Math.floor((32+5)*gp.buttons[i].value), 4);
				ctx.fillStyle = "black";
				ctx.drawImage(strutControllers[controllerType].buttons[i].onImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}else{
				ctx.drawImage(strutControllers[controllerType].buttons[i].offImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}
			buffer[strutControllers[controllerType].buttons[i].bufferTriggerPos] = Math.min(Math.floor((gp.buttons[i].value*0xff)),0xff);
			buffer[strutControllers[controllerType].buttons[i].bufferPos] ^= (-gp.buttons[i].pressed ^ buffer[strutControllers[controllerType].buttons[i].bufferPos]) & (1 << strutControllers[controllerType].buttons[i].relPos);
		}else if(strutControllers[controllerType].buttons[i].type == "DPad"){
			
			if(gp.buttons[i].pressed){
				ctx.drawImage(strutControllers[controllerType].buttons[i].onImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}else{
				ctx.drawImage(strutControllers[controllerType].buttons[i].offImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x, strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y);
			}
			hatSwitchMagicNumber ^= (-gp.buttons[i].pressed ^ hatSwitchMagicNumber) & (1 << strutControllers[controllerType].buttons[i].hatN);
		}else if(strutControllers[controllerType].buttons[i].type == "joystick"){
			buffer[axesBuffer[axesCount]] = Math.min(Math.floor((gp.axes[axesCount]+1)*0x80),0xff)
			buffer[axesBuffer[axesCount+1]] = Math.min(Math.floor((gp.axes[axesCount+1]+1)*0x80),0xff)
			buffer[strutControllers[controllerType].buttons[i].bufferPos] ^= (-gp.buttons[i].pressed ^ buffer[strutControllers[controllerType].buttons[i].bufferPos]) & (1 << strutControllers[controllerType].buttons[i].relPos);
			if(gp.buttons[i].pressed){
				ctx.drawImage(strutControllers[controllerType].buttons[i].onImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x + (gp.axes[axesCount]*16), strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y + (gp.axes[axesCount+1]*16));
				axesCount+=2;
			}else{
				ctx.drawImage(strutControllers[controllerType].buttons[i].offImg, strutControllers[controllerType].buttons[i].x + strutControllers[controllerType].x + (gp.axes[axesCount]*16), strutControllers[controllerType].buttons[i].y + strutControllers[controllerType].y + (gp.axes[axesCount+1]*16));
				axesCount+=2;
			}
		}
	}
	buffer[10] = hatSwitchObj[hatSwitchMagicNumber];
	curTime = Date.now();
	deltaTime += curTime-prevTime;
	prevTime = curTime;
	for(let i = 0; i < buffer.length;i++){
		if(document.getElementById("z"+i+"c").checked){
			buffer[i] = parseInt(document.getElementById("z"+i).value)
		}else{
			document.getElementById("z"+i).value = buffer[i];
		}
		
	}
	if(connected && socket.readyState == 1){
		if(deltaTime > minTime){
				socket.send(new Uint8Array(buffer));
			deltaTime = 0;
		}
	}
	
	ctx.scale(strutControllers[controllerType].imgController.width/c.width*(1/0.85), strutControllers[controllerType].imgController.height/c.height*(1/0.85));
        
	loop = rAF(gameLoop);
}