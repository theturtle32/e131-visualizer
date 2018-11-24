const Koa = require('koa');
const serve = require('koa-serve-static');
const http = require('http');
const WebSocketServer = require('websocket').server;
const bridge = require('./e131bridge');

let app = new Koa();
app.use(serve('./static'));

let server = http.createServer()
server.on('request', app.callback());

let wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', (request) => {
  let connection = request.accept();
  console.log("Connection opened");
  
  connection.on('close', () => {
    console.log("Connection closed");
  });
});

server.listen(3000);

bridge(wsServer);
