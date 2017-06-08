var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('../client/build'))

// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/battery', function (req, res) {
  res.json({
      voltage: 7890,
      current: 160
  });
});

app.ws('/ws', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('received message from frontend "' + msg + '"');
    ws.send(msg);
  });
});

//start a server on port 80 and log its start to our console
var server = app.listen(3001, function () {

  var port = server.address().port;
  console.log('Updated example app listening on port ', port);

});
