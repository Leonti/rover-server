const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.0.109:5001/ws');
 
ws.on('open', function open() {
  ws.send('{"motor": { "command": {"move": {"speed": 20, "ticks": 3000, "p": 3.0, "i": 0.05, "d": 0.0 }}}}');
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});
