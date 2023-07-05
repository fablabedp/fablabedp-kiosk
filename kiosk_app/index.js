#!/usr/bin/env node

import app from './app.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

/////// used by sockets
import { sendEmail } from './email.js';
import { removePhoto } from './photos.js';
//////

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// https://stackoverflow.com/questions/65721253/how-to-use-socket-io-in-node-js-with-es6-syntax
const io_socket = new Server(server, { cors: { origin: '*' } });




function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}

// close the server when killing the process
// https://stackoverflow.com/questions/14515954/how-to-properly-close-node-js-express-server
process.on('SIGINT', function() {
  server.close((err) => {
    console.log('server closed')
    process.exit(err ? 1 : 0)
  })
});




// websockets
io_socket.on('connection', (socket) => {

  console.log('io socket connected');

  socket.on('take_photo', () => {
    // remove temporary photo when taking a new one
    removePhoto();
  });

  socket.on('send_email', (email_address) => {
    console.log('sending email to', email_address);
    sendEmail(email_address);
  });

});
