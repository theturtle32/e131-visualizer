import 'babel-polyfill';
import 'babel-register';
import Koa from 'koa';
import serve from 'koa-serve-static';
import http from 'http';
import {server as WebSocketServer} from 'websocket';
import bridge from './e131bridge';

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
